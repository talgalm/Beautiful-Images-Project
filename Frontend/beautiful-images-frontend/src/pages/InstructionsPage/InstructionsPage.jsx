import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import './instructionsPage.css'

export default function InstructionsPage (){
    const [isReturningUser , setReturningUser] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const isRtl = ['he'].includes(i18n.language);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        if (!token || !email) {
            navigate("/home"); 
        }
    }, []); 

    function handleGoToRating(){
        navigate("/rating");
    } 

    return (
        <div className="header-wrapper">
            <Header/>
            <div className="guidelines-div">
                <div className="left-div"></div>
                <div className="text-div">
                {isReturningUser ? 
                (<div dir={isRtl ? 'rtl' : 'ltr'}>
                    <Trans i18nKey="returningGeneralInstructions" components={{ br: <br /> }} />
                </div>) 
                :
                (<div dir={isRtl ? 'rtl' : 'ltr'}>
                    <Trans i18nKey="generalInstructions" components={{ br: <br /> }} />
                </div>)}
                </div>
                
            </div>
            <div className="button-div">
                <button className='button-c' onClick={handleGoToRating}>{t('continue')}</button>
            </div>
        </div>
    );
}
