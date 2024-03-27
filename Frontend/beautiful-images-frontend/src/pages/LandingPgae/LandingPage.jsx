import { useTranslation , Trans} from 'react-i18next';
import './landingPage.css';
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import {Modal} from 'react-bootstrap';


export default function LandingPage(){
    const { t , i18n} = useTranslation();
    const isRtl = ['he'].includes(i18n.language);
    const [isChecked, setIsChecked] = useState(false);
    const [isOK, setIsOK] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        const expireTime = localStorage.getItem('expireTime');
        const currentTime = new Date().getTime();

        if (expireTime && currentTime > expireTime) {
            localStorage.removeItem('token');
            localStorage.removeItem('email');
        }
    }, []);


    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
        setIsOK (!event.target.checked)
    };

    const handleButtonClick = () => {
        if (!isChecked) {
            setIsOK(true);
        } else {
            navigate("/home")
        }
    };


    return (
        <div className='landing-div'>
            <div className='instructions-div' style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <p className='p-intro'><Trans i18nKey="landingIntro" components={{ br: <br /> }} /></p>
                <div className='checkbox-ok-div' style={{ }}>
                    {!isRtl ? (
                        <>
                            <input 
                                type="checkbox" 
                                id="myCheckbox" 
                                name="myCheckbox" 
                                className='myCheckbox'
                                checked={isChecked} 
                                onChange={handleCheckboxChange}
                            />
                            <label className='l-1' htmlFor="myCheckbox" style={{marginLeft: '20px'}}>{t('checkboxAgreeExp')}</label>
                        </>
                    ) : (
                        <>
                            <label className='l-1' htmlFor="myCheckbox"  style={{marginRight: '10px'}}>{t('checkboxAgreeExp')}</label>
                            <input 
                                type="checkbox" 
                                id="myCheckbox" 
                                name="myCheckbox" 
                                className='myCheckbox'
                                checked={isChecked} 
                                onChange={handleCheckboxChange}
                            />
                        </>
                    )}
                </div>
                {isOK ? <div style={{ color: 'red' }}>{t('checkToAgree')}</div>
: (
  <div style={{ height: '25px', width: '100%', backgroundColor: 'white', color: 'white' }}>
    {t('checkToAgree').replace('s', ' ')}
  </div>
)}
                <div className='buttons-div'>
                    <button className='button-c' onClick={handleButtonClick}>{t('continue')}</button>
                </div>
            </div>

        </div>
    );
}
