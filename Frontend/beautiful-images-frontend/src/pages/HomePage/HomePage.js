import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './homePage.css'
import { handleUserLogin, handleUserRegistration } from '../../services/userService';
import { useNavigate } from "react-router-dom";
import LanguageSwitcher from '../../components/LanguageSwitcher';
import Header from '../../components/Header/Header';


export default function HomePage (){
  const { t, i18n } = useTranslation();
  const [isSignUpActive, setSignUpActive] = useState(false);
  const [email , setEmail] = useState('')
  const [nickname , setNickname] = useState('')
  const [emailConfirm , setEmailConfirm] = useState('')
  const [age , setAge] = useState('')
  const [gender , setGender] = useState('')
  const [country , setCountry] = useState('')
  const navigate = useNavigate();

  const isRtl = ['he'].includes(i18n.language);


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
    setEmail(event.target.value);
  }
  function handleUsernameConfirmChange(event){
    setEmailConfirm(event.target.value);
  }

  function handleNickname(event){
    setNickname(event.target.value);
  }

  function handleAgeChange(event){
    setAge(event.target.value);
  }
  function handleGenderChange(event){
    setGender(event.target.value);
  }
  function handleCountryChange(event){
    setCountry(event.target.value);
  }

  function handleRegistration(){
    if (emailConfirm === email){
      handleUserRegistration(email , nickname , age , country , gender)
      .then(data => {
        //if success -> alert user and go to start rating
        //if fail -> alert user about the message
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
    else{
      alert(t('UsernamesError'))
    }

  }
  function handleLogin(){
    if (email === ''){
      alert(t('cantBeEmpty'))
    }
    else{
      navigate("/instructions")
    }

  }

  useEffect(() => {

  }, []);


  return (<div className="header-wrapper">
    <Header/>

    <div className={`container ${isSignUpActive ? 'right-panel-active' : ''}`} id="container">
    <div className="form-container sign-up-container">
      <form action="#"  className='form-2'>
        <h1>{t('createAccount')}</h1>
        <input required type="input" placeholder={t('enterUsername')} value={email} onChange={handleUsernameChange}  dir={isRtl ? 'rtl' : 'ltr'}/>
        <input required type="input" placeholder={t('enterUsernameConfirm')} value={emailConfirm} onChange={handleUsernameConfirmChange}  dir={isRtl ? 'rtl' : 'ltr'}/>
        <input type="input" placeholder={t('enterNickname')} value={nickname} onChange={handleNickname}  dir={isRtl ? 'rtl' : 'ltr'}/>
        <select value={gender} onChange={handleGenderChange} dir={isRtl ? 'rtl' : 'ltr'}>
          <option value="" disabled>{t('enterGender')}</option> 
          <option value="male">{t('Male')}</option>
          <option value="female">{t('Female')}</option>
          <option value="other">{t('Other')}</option>
        </select>
        <input type="input" placeholder={t('enterCountry')} value={country} onChange={handleCountryChange}  dir={isRtl ? 'rtl' : 'ltr'}/>
        <input placeholder={t('age')} value={age}  onChange={handleAgeChange}  dir={isRtl ? 'rtl' : 'ltr'}/>
        <button className="button-53" onClick={handleRegistration} >{t('signUp')}</button>
      </form>
    </div>
    <div className="form-container sign-in-container">
      <form action="#" className='form-1'>
        <h1 className='h1-sign'>{t('signIn')}</h1>
        <input required type="input" placeholder={t('enterUsername')} className='form-1-sign' value={email} onChange={handleUsernameChange} dir={isRtl ? 'rtl' : 'ltr'}/>
        <button className="button-53" onClick={handleLogin}>{t('continue')}</button>
      </form>
    </div>
    <div className="overlay-container">
      <div className="overlay">
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
      </div>
    </div>
  </div>
  </div>
  );
};
