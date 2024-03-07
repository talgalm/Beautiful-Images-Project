import { useTranslation } from 'react-i18next';
import './header.css';
import LanguageSwitcher from '../LanguageSwitcher';
import { useState } from 'react';
import userIcon from './user.svg';
import userLoginIcon from './loginUser.svg'; 
import instructionsIcon from './instructions.png'; 
import { useLocation } from 'react-router-dom'; // Import useLocation hook


export default function Header (){
    const { t } = useTranslation();
    const [loggedIn , setLoggedIn] = useState(false);
    const location = useLocation(); 

    const isHomeOrRoot = () => {
        return location.pathname === '/' || location.pathname === '/home';
    };

    return(
    <div className='header-div'>
        <div className='logo-div'> </div>
        <div className='icons-div'> 
            <div className='icon-panel'>
                <LanguageSwitcher/>
                {!isHomeOrRoot() && 
                    <div>
                    {loggedIn ? 
                        (<img src={userLoginIcon}></img>) 
                    : 
                        (<img src={userIcon}></img>)}
                        <img className='instructions-icon' src={instructionsIcon}></img>
                    </div>}

            </div>
        </div>
    </div>)
}