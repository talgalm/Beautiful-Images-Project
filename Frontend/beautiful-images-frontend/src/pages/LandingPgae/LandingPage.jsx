import { useTranslation , Trans} from 'react-i18next';
import './landingPage.css';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";


export default function LandingPage(){
    const { t , i18n} = useTranslation();
    const isRtl = ['he'].includes(i18n.language);
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();


    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleButtonClick = () => {
        if (!isChecked) {
            alert(t('checkToAgree'));
        } else {
            navigate("/home")
        }
    };

    return (
        <div className='landing-div'>
            <div className='images-example-div'></div>
            <div className='instructions-div' style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <p className='p-intro'><Trans i18nKey="landingIntro" components={{ br: <br /> }} /></p>
                <div className='checkbox-ok-div' style={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
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
                            <label className='l-1' htmlFor="myCheckbox">{t('checkboxAgreeExp')}</label>
                        </>
                    ) : (
                        <>
                            <label className='l-1' htmlFor="myCheckbox">{t('checkboxAgreeExp')}</label>
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
                <div className='buttons-div'>
                    <button className='button-c' onClick={handleButtonClick}>{t('continue')}</button>
                </div>
            </div>
        </div>
    );
}