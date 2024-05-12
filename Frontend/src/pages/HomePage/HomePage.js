import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './homePage.css'
import { handleUserLogin, handleUserRegistration } from '../../services/userService';
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from '../../components/LanguageSwitcher';
import Header from '../../components/Header/Header';
import {countries} from '../HomePage/hebrewCountries.js';

import useAutoLogout from '../../hooks/useAutoLogout.js';

export default function HomePage (){
  const { t, i18n } = useTranslation();
  const [isSignUpActive, setSignUpActive] = useState(false);
  const [email , setEmail] = useState('')
  const [nickname , setNickname] = useState('')
  const [emailConfirm , setEmailConfirm] = useState('')
  const [age , setAge] = useState('')
  const [gender , setGender] = useState('')
  const [country , setCountry] = useState('')
  const [error , setError] = useState(undefined)
  const [errorInRegistration , setInRegistraion] = useState(undefined)

  const { isLoggedIn, handleLoginInLocalStorage } = useAutoLogout();


  const navigate = useNavigate();
  const mobileScreen = window.innerWidth <= 400;
  const isRtl = ['he'].includes(i18n.language);
  const Countries = countries.map(item => item);

  function changeDisplay(){
    setSignUpActive(!isSignUpActive)
    setAge('')
    setEmail('')
    setEmailConfirm('')
    setNickname('')
    setGender('')
    setCountry('')
  }

  function handleUsernameChange(event){
    setError("")
    setInRegistraion("")
    setEmail(event.target.value);
  }
  function handleUsernameConfirmChange(event){
    setInRegistraion("")
    setEmailConfirm(event.target.value);
  }

  function handleNickname(event){
    setNickname(event.target.value);
  }

  function handleAgeChange(event){
    setInRegistraion("")
    setAge(event.target.value);
  }
  function handleGenderChange(event){
    setGender(event.target.value);
  }
  function handleCountryChange(event){
    setCountry(event.target.value);
  }

  function handleRegistration(event){
    event.preventDefault();
    const isAge = (!isNaN(parseInt(age)) && parseInt(age) >= 18 && parseInt(age) <= 99);
    const isEmail = (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
    const matchingEmail = emailConfirm === email;
    if (!isAge){
      setInRegistraion("ageValidation")
    }
    if (!isEmail){
      setInRegistraion("invalidEmail")
    }
    if (!matchingEmail){
      setInRegistraion("emailsDontMatch")
    }
    else if (isAge && isEmail && matchingEmail){
      handleUserRegistration(email , nickname , age , country , gender)
      .then(data => {
        if (data.message === 'User registered successfully'){
          handleLogin(event)
        }
        else{
          setInRegistraion(data.message.replace(/\s/g, ''))
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
    else{
      
    }

  }
  function handleLogin(event){
    event.preventDefault(); 
    handleUserLogin(email)
    .then(data => {
      if ( data.message === 'Login successful' && data.token ){
        handleLoginInLocalStorage()
        localStorage.setItem('token',data.token)
        localStorage.setItem('email',email)
        navigate("/instructions")
      }
      else{
        if (data.message === 'Email does not exist')
          setError(data.message)
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });

  }

  function handleAdminLogin(event){
    navigate("/adminLogin")
  }

  useEffect(() => {

  }, []);


  return (
    <div>
    <div className="header-wrapper">
    <Header/>

    <div className={`container ${isSignUpActive ? 'right-panel-active' : ''}`} id="container">
    <div className="form-container sign-up-container">
      <form action="#"  className='form-2'>
        <h1>{t('createAccount')}</h1>
        <input required type="input" placeholder={t('enterUsername')} value={email} onChange={handleUsernameChange}  dir={isRtl ? 'rtl' : 'ltr'} className={errorInRegistration ? 'err-div' : ''} />
        <input required type="input" placeholder={t('enterUsernameConfirm')} value={emailConfirm} onChange={handleUsernameConfirmChange}  dir={isRtl ? 'rtl' : 'ltr'} className={errorInRegistration ? 'err-div' : ''} />
        <input type="input" placeholder={t('enterNickname')} value={nickname} onChange={handleNickname}  dir={isRtl ? 'rtl' : 'ltr'}  />
        <select value={gender} onChange={handleGenderChange} dir={isRtl ? 'rtl' : 'ltr'}>
          <option value="" disabled>{t('enterGender')}</option> 
          <option value="male">{t('Male')}</option>
          <option value="female">{t('Female')}</option>
          <option value="other">{t('Other')}</option>
        </select>
        <select value={country} onChange={handleCountryChange} dir={isRtl ? 'rtl' : 'ltr'}>
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
        <input placeholder={t('age')} value={age}  onChange={handleAgeChange} className={errorInRegistration ? errorInRegistration ==='Userwiththisemailalreadyexists' ? '' :'err-div' : ''} dir={isRtl ? 'rtl' : 'ltr'}/>
        <span style={{color:'red' , height: '25px' , width:'100%'}}>{t(errorInRegistration)}</span>
        <button className="button-53" onClick={handleRegistration} >{t('signUp')}</button>
      </form>
    </div>
    <div className="form-container sign-in-container">
      <form action="#" className='form-1'>
        <h1 className='h1-sign'>{t('signIn')}</h1>
        <input required type="input" placeholder={t('enterUsername')} className= {error ? 'form-1-sign-error' : 'form-1-sign'} value={email} onChange={handleUsernameChange} dir={isRtl ? 'rtl' : 'ltr'}/>
        <span style={{color:'red' , height: '25px' , width:'100%'}}>{t(error)}</span>
        <button className="button-53" onClick={handleLogin}>{t('continue')}</button>
        <button className="button-53" onClick={handleAdminLogin}>{t('adminLogin')}</button>
      </form>
    </div>
    <div className="overlay-container">
      {!mobileScreen && <div className="overlay">
        <div className="overlay-panel overlay-left">
          <h1 className='h1-over-l'>{t('welcomeBack')}</h1>
          <p className='p-over-l'>{t('loginHere')}</p>
          <button className="button-53" id="signIn" onClick={changeDisplay}>
          {t('login')}
          </button>
        </div>
        <div className="overlay-panel overlay-right">
          <h1 className='h1-over-r'> {t('helloFriend')}</h1>
          <p className='p-over-r'> {t('firstTime')}</p>
          <button className="button-53" id="signUp" onClick={changeDisplay}>
          {t('signUp')}
          </button>
        </div>
      </div>}
    </div>
  </div>
  </div>
  {mobileScreen && 
  <div className='button-in-mobile'>
      <button className="button-53" id="signUp" onClick={changeDisplay}>
        {isSignUpActive ? t('signInMobile') : t('signUpMobile')}
      </button>
    </div>}

    </div>
  
  );
};
