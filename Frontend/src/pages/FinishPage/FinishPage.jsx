import './finishPage.css'
import { useTranslation, Trans } from "react-i18next";
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';

export default function FinishPage(){
    const { t , i18n} = useTranslation();
    const isRtl = ['he'].includes(i18n.language);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('email');

        if (!token || !email) {
            navigate("/home"); 
        }
    }, []); 

    const backHome = () => {
        navigate("/");
      }
    

    return (
        <div className='header-wrapper'>            
            <Header/>
            <div className='finish-div' style={{ textAlign: isRtl ? 'right' : 'left' }}>
                <div className='thank-you-div' style={{flexDirection : isRtl ? ' row-reverse' : 'row'}} >{t('finishExperiment1')}</div>
                <div className='thank-you-div' style={{flexDirection : isRtl ? ' row-reverse' : 'row'}} >{t('finishExperiment2')}</div>
                <div className='thank-you-div' style={{flexDirection : isRtl ? ' row-reverse' : 'row'}} >                 
                     <div>{t('finishExperiment3')}</div>
                    <div className='survey-link'>
                        <a href='https://forms.gle/dCvjDjZMYmvmRCfp6' target='_blank'>{t('finishExperiment4')}</a>
                        </div>
                </div>
                <div className='thank-you-div' style={{flexDirection : isRtl ? ' row-reverse' : 'row'}} >{t('finishExperiment5')}</div>
                <button className="button-53" onClick={backHome}>{t('backHome')}</button>
            </div>
        </div>
    );
}