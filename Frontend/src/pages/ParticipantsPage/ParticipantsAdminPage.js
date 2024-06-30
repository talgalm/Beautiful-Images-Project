import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { useTable, useFilters } from 'react-table';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header/Header';
import './ParticipantsAdminPage.css';
import { handleGetParticipantsData } from '../../services/adminService';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../../components/AdminNavBar/adminNavBar';
import {countries} from '../HomePage/hebrewCountries.js';

// Register the components in Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const ParticipantsAdminPage = () => {

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filter, setFilter] = useState({ gender: '', country: '', ageRange: [0, 100] });
    const Countries = countries.map(item => item);
    const isRtl = ['he'].includes(i18n.language);
    const [country , setCountry] = useState('')

    useEffect(() => {
        handleGetParticipantsData()
        .then(data => { 
            setUsers(data.participants);
            setFilteredUsers(data.participants);
        })
        .catch((error) => {
          console.error('Error :', error);
        });
    }, []);

    useEffect(() => {
        applyFilter();
    }, [filter]);

    const applyFilter = () => {
        setFilteredUsers(users.filter(user => {
            return (!filter.gender || user.gender === filter.gender)
                && (!filter.country || user.country === filter.country)
                && (user.age >= filter.ageRange[0] && user.age <= filter.ageRange[1]);
        }));
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilter({
            ...filter,
            [name]: value
        });
    };

    function handleCountryChange(event){
        const chosenCountryName = event.target.value;
        setCountry(chosenCountryName);
        let found = false;

        countries.find((country)=> {
            if (!found && (country.name === chosenCountryName || country.english_name == chosenCountryName)){
                const countryEnglishNameEvent = {
                    target: {
                        name: event.target.name,    
                        value : country.english_name
                    }
                }

                handleFilterChange(countryEnglishNameEvent);
                found = true;
            } 
        })

        if(!found){
            handleFilterChange(event);
        }
   
    }

    const handleAgeRangeChange = (e, index) => {
        const newRange = [...filter.ageRange];
        newRange[index] = parseInt(e.target.value, 10);
        setFilter({ ...filter, ageRange: newRange });
    };

    const pieData = {
        labels: [t('Male'), t('Female')],
        datasets: [{
            data: [
                filteredUsers.filter(user => user.gender === 'male').length,
                filteredUsers.filter(user => user.gender === 'female').length,
            ],
            backgroundColor: ['#36A2EB', '#FF6384'],
        }]
    };

        // Function to group ages into bins
    const groupAgesIntoBins = (users, binSize) => {
        const ageBins = {};
        users.forEach(user => {
            const bin = Math.floor(user.age / binSize) * binSize;
            if (!ageBins[bin]) {
                ageBins[bin] = 0;
            }
            ageBins[bin]++;
        });
        return ageBins;
    };

    const AgeDistributionChart = ({ filteredUsers }) => {
        const binSize = 10; // Set the bin size (e.g., 10 years per bin)

        const ageBins = groupAgesIntoBins(filteredUsers, binSize);
        const labels = Object.keys(ageBins).map(bin => `${bin}-${parseInt(bin) + binSize - 1}`);
        const data = Object.values(ageBins);

        const barData = {
            labels: labels,
            datasets: [{
                label: t('ageDistribution'),
                data: data,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        };

        const barOptions = {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: t('ageRange')
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: t('numOfParticipants')
                    },
                    beginAtZero: true,
                    ticks: {
                        precision: 0, // Display Y-axis values as integers
                        stepSize: 1 // Ensure integer steps between ticks
                    }
                    
                }
            }
        };

        return <Bar data={barData} options={barOptions} />;
    };

    const UsersByCountryBarChart = ({ filteredUsers }) => {
        const { t } = useTranslation();
    
        // Function to get unique countries and count users per country
        const countries = [...new Set(filteredUsers.map(user => user.country))];
        const userCounts = countries.map(country =>
            filteredUsers.filter(user => user.country === country).length
        );
    
        const barData = {
            labels: countries,
            datasets: [{
                label: t('usersByCountry'),
                data: userCounts,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            }]
        };
    
        const barOptions = {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: t('country')
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: t('numOfParticipants')
                    },
                    beginAtZero: true, // Start Y-axis from zero
                    ticks: {
                        stepSize: 1, // Ensure integer steps between ticks
                        precision: 0 // Display Y-axis values as integers
                    }
                }
            }
        };
    
        return <Bar data={barData} options={barOptions} />;
    };

    return (
        <div>
            <Header />
            <AdminNavBar />
            <div className="admin-page">
                <div className='header'>{t('participants')}</div>
                {users?.length === 0 && <div className='no-data-message'>{t('noParticipantsData')}</div>}
                <div className="filter-controls">
                    <label>
                        {t("gender")}
                        <select name="gender" value={filter.gender} onChange={handleFilterChange} dir={isRtl ? 'rtl' : 'ltr'}>
                            <option value="">{t('selectGender')}</option>
                            <option value="male">{t('Male')}</option>
                            <option value="female">{t('Female')}</option>
                        </select>
                    </label>
                    <label>
                    {t("country")}
                    <select name="country" value={country} onChange={handleCountryChange} dir={isRtl ? 'rtl' : 'ltr'}>
                <option value="">{t("selectCountry")}</option>
                {isRtl ? (Countries.map(obj => obj.name).map((country, index) => (
                    <option key={index} value={country}>
                        {country}
                    </option>
                ))) : (Countries.map(obj => obj.english_name).sort().map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
              )))}
                
            </select>
                    </label>
                    <label>
                    {t("ageRange")}
                        <input type="number" value={filter.ageRange[0]} onChange={(e) => handleAgeRangeChange(e, 0)} />
                        -
                        <input type="number" value={filter.ageRange[1]} onChange={(e) => handleAgeRangeChange(e, 1)} />
                    </label>
                </div>
                <div className="charts">
                    <div className="chart">
                        <UsersByCountryBarChart filteredUsers={filteredUsers} />
                    </div>
                    <div className="chart">
                        <Pie data={pieData} />
                    </div>
                    <div className="chart">
                        <AgeDistributionChart filteredUsers={filteredUsers} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantsAdminPage;
