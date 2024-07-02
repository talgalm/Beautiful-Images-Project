import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import './instructionsPage.css'
import video from '../../icons/video.mov'



export default function InstructionsPage (){
    const [isReturningUser , setReturningUser] = useState(localStorage.getItem("nowRegistered") !== null);
    
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { i18n } = useTranslation();
    const isRtl = ['he'].includes(i18n.language);
    const isMobile = window.innerWidth <= 430

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
            <div className="guidelines-div"  style={{flexDirection : isRtl ? 'row-reverse' : 'row'}}>
             
                <div className="text-div-d" style={{justifyContent : isRtl ? 'flex-end' : 'flex-start'}}>
                {!isReturningUser ? 
                (<div dir={isRtl ? 'rtl' : 'ltr'} style={{flexDirection : isMobile ? 'column' : ''}}  className="text-ins">
                    <Trans i18nKey="returningGeneralInstructions" components={{ br: <br /> }} />
                    {isMobile && <div>
                    <video
                        style={{ width: '100%' , marginTop : '10px'}}
                        loop
                        autoPlay
                        muted
                        controls
                    >
                        <source src={video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    </div>}
                </div>) 
                :
                (<div dir={isRtl ? 'rtl' : 'ltr'} style={{flexDirection : isMobile ? 'column' : ''}} className="text-ins">
                    <Trans i18nKey="generalInstructions" components={{ br: <br /> }} />
                    {isMobile && <div>
                    <video
                        style={{ width: '100%' , marginTop : '10px'}}
                        loop
                        autoPlay
                        muted
                        controls
                    >
                        <source src={video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    </div>}
                </div>)}
   
                </div>
                {!isMobile && <div>
                    <video
                        style={{ width: '350px', height: '300px' , marginLeft : '50px' ,  marginRight : '19px'}}
                        loop
                        autoPlay
                        muted
                        controls
                    >
                        <source src={video} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    </div>}
            </div>

            <div className="button-div" style={{justifyContent: isRtl ? 'flex-start' :'flex-end'}}>
                <button className='button-c' onClick={handleGoToRating}>{t('continue')}</button>
            </div>
        </div>
    );
}
