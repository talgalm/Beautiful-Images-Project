import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './homePage.css'
import { handleUserLogin, handleUserRegistration } from '../../services/userService';
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';
import {countries} from '../HomePage/hebrewCountries.js';
import { handleAdminLogin } from '../../services/adminService';



export default function HomePage (){
  const { t, i18n } = useTranslation();
  const [isSignUpActive, setSignUpActive] = useState(false);
  const [email , setEmail] = useState('')
  const [nickname , setNickname] = useState('')
  const [emailConfirm , setEmailConfirm] = useState('')
  const [age , setAge] = useState('')
  const [gender , setGender] = useState('')
  const [country , setCountry] = useState('')
  const [countryEnglishName , setCountryEnglishName] = useState('')
  const [error , setError] = useState(undefined)
  const [errorInRegistration , setInRegistraion] = useState(undefined)

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
    const chosenCountryName = event.target.value;
    setCountry(chosenCountryName);

    countries.find((country)=> {
      if (country.name === chosenCountryName || country.english_name == chosenCountryName )
        setCountryEnglishName(country.english_name);
    })
  }

  function handleRegistration(event){
    
    event.preventDefault();
    const isEmail = (/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/i.test(email));
    const matchingEmail = emailConfirm === email;
    const agePattern = /^\d*$/;
    const ageNum = parseInt(age);
    let isAge = true;
    
    if (!agePattern.test(age)) {
      setInRegistraion("AgeMustContainOnlyNumbers")
        isAge = false;
    } else if (age === '' || ageNum < 18 || ageNum > 99) {
        if (!(ageNum >= 18 && ageNum <= 99) ) {
          setInRegistraion("AgeMustBeBetween1899")
        } else  {
          isAge = false;
        }
    }
    else if (!isEmail){
      setInRegistraion("invalidEmail")
    }
    else if (!matchingEmail){
      setInRegistraion("emailsDontMatch")
    }

    else if ( isEmail && matchingEmail){
      handleUserRegistration(email , nickname , age , countryEnglishName , gender)
      .then(data => {
        if (data.message === 'User registered successfully'){
          localStorage.setItem('nowRegistered',"true")
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
    if (email.includes('admin@gmail.com')){
      handleAdminLogin(email, 'admin123')
      .then((data) => {
        if (data.message === 'Login successful' && data.token) {
          navigate("/admin/participants");
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError('Login failed. Please try again.');
      });
    }
    else {
      handleUserLogin(email)
      .then(data => {
        if ( data.message === 'Login successful' && data.token ){
          localStorage.setItem('token',data.token)
          localStorage.setItem('email',email)
          localStorage.setItem('nickname',data.nickname)
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

  }

  // function handleAdminLogin(event){
  //   navigate("/adminLogin")
  // }
  

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
        <input placeholder={t('age')} value={age}  onChange={handleAgeChange} dir={isRtl ? 'rtl' : 'ltr'} className={errorInRegistration ? age != '' ? 'err-div' :'' : ''} />
        <span style={{color:'red' , height: '25px' , width:'100%'}}>{t(errorInRegistration)}</span>
        <button className="button-53" onClick={handleRegistration} style={{marginBottom :"-50px", marginTop :'35px'}}>{t('signUp')}</button>
      </form>
    </div>
    <div className="form-container sign-in-container">
      <form action="#" className='form-1'>
        <h1 className='h1-sign'>{t('signIn')}</h1>
        <input required type="input" placeholder={t('enterUsername')} className= {error ? 'form-1-sign-error' : 'form-1-sign'} value={email} onChange={handleUsernameChange} dir={isRtl ? 'rtl' : 'ltr'}/>
        <span style={{color:'red' , height: '25px' , width:'100%'}}>{t(error)}</span>
        <button className="button-53" onClick={handleLogin}>{t('continue')}</button>
        {/* <button className="button-53" onClick={handleAdminLogin}>{t('adminLogin')}</button> */}
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
