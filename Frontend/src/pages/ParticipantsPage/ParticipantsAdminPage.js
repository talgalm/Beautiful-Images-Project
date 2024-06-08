// ParticipantsAdminPage.js
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { useTable, useFilters } from 'react-table';
import { useTranslation } from 'react-i18next';
import Header from '../../components/Header/Header';
import './ParticipantsAdminPage.css';
import { handleGetParticipantsData } from '../../services/adminService';
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

    const { t } = useTranslation();
    // Mock data
    const mockUsers = [
        { name: 'Alice', gender: 'female', country: 'USA', age: 25 },
        { name: 'Bob', gender: 'male', country: 'Canada', age: 30 },
        { name: 'Charlie', gender: 'male', country: 'UK', age: 35 },
        { name: 'David', gender: 'male', country: 'USA', age: 40 },
        { name: 'Eve', gender: 'female', country: 'Canada', age: 28 },
        // Add more mock data as needed
    ];

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [filter, setFilter] = useState({ gender: '', country: '', ageRange: [0, 100] });

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

    const handleAgeRangeChange = (e, index) => {
        const newRange = [...filter.ageRange];
        newRange[index] = parseInt(e.target.value, 10);
        setFilter({ ...filter, ageRange: newRange });
    };

    const barData = {
        labels: [...new Set(filteredUsers.map(user => user.country))],
        datasets: [{
            label: t('usersByCountry'),
            data: [...new Set(filteredUsers.map(user => user.country))].map(
                country => filteredUsers.filter(user => user.country === country).length
            ),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
        }]
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

    const lineData = {
        labels: Array.from(new Set(filteredUsers.map(user => user.age))),
        datasets: [{
            label: t('ageDistribution'),
            data: Array.from(new Set(filteredUsers.map(user => user.age))).map(
                age => filteredUsers.filter(user => user.age === age).length
            ),
            fill: false,
            borderColor: 'rgba(75, 192, 192, 1)',
        }]
    };

    const columns = React.useMemo(
        () => [
            {
                Header: t("gender"),
                accessor: 'gender',
            },
            {
                Header: t("country"),
                accessor: 'country',
            },
            {
                Header: t("age"),
                accessor: 'age',
            },
        ],
        []
    );

    const data = React.useMemo(
        () => filteredUsers,
        [filteredUsers]
    );

    const tableInstance = useTable({ columns, data }, useFilters);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance;

    return (
        <div>
            <Header />
            <div className="admin-page">
                <div className='header'>{t('participants')}</div>
                {users?.length === 0 && <div className='no-data-message'>{t('noParticipantsData')}</div>}
                <div className="filter-controls">
                    <label>
                        {t("gender")}
                        <select name="gender" value={filter.gender} onChange={handleFilterChange}>
                            <option value="">All</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </label>
                    <label>
                    {t("country")}
                        <input name="country" value={filter.country} onChange={handleFilterChange} />
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
                        <Bar data={barData} />
                    </div>
                    <div className="chart">
                        <Pie data={pieData} />
                    </div>
                    <div className="chart">
                        <Line data={lineData} />
                    </div>
                </div>
                <div className="table">
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map(headerGroup => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map(column => (
                                        <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()}>
                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ParticipantsAdminPage;
