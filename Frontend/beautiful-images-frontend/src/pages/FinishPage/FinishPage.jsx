import './finishPage.css'
import { useTranslation , Trans} from 'react-i18next';
import { useEffect, useState } from 'react';
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

    return (
        <div className='header-wrapper'>            
            <Header/>
            <div className='finish-div'>
                <div className='images-example-div'>
                </div>
                <div className='thank-you-div' style={{ textAlign: isRtl ? 'right' : 'left' }}>

                </div>
            </div>
        </div>
    );
}