import './finishPage.css'
import { useTranslation , Trans} from 'react-i18next';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';

export default function FinishPage(){
    const { t , i18n} = useTranslation();
    const isRtl = ['he'].includes(i18n.language);
    const navigate = useNavigate();

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