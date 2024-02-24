import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import './homePage.css'
import { handleUserLogin, handleUserRegistration } from '../services/userService';

const HomePage = () => {
  const { t } = useTranslation();
  const [isSignUpActive, setSignUpActive] = useState(false);
  const [username , setUsername] = useState('')
  const [age , setAge] = useState('')

  function changeDisplay(){
    setSignUpActive(!isSignUpActive)
    setAge('')
    setUsername('')
  }

  function handleUsernameChange(event){
    setUsername(event.target.value);
  }

  function handleAgeChange(event){
    setAge(event.target.value);
  }

  function handleRegistration(){
    handleUserRegistration(username , age)
    .then(data => {
      //if success -> alert user and go to start rating
      //if fail -> alert user about the message
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }
  function handleLogin(){
    handleUserLogin(username)
    .then(data => {
      //if success -> alert user and go to dashboard rating
      //if fail -> alert user about the message
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  useEffect(() => {

  }, []);


  return (
    <div className={`container ${isSignUpActive ? 'right-panel-active' : ''}`} id="container">
    <div className="form-container sign-up-container">
      <form action="#">
        <h1>CreateAccount</h1>
        <div className="social-container">
          <a href="#" className="social">
            <FontAwesomeIcon icon={faFacebook} />
          </a>
          <a href="#" className="social">
            <FontAwesomeIcon icon={faGoogle} />
          </a>
          <a href="#" className="social">
            <FontAwesomeIcon icon={faLinkedin} />
          </a>
        </div>
        <input type="input" placeholder='username' value={username} onChange={handleUsernameChange}/>
        <input placeholder='Age' value={age}  onChange={handleAgeChange}/>
        <button className="button-53" onClick={handleRegistration} >SignUp</button>
      </form>
    </div>
    <div className="form-container sign-in-container">
      <form action="#">
        <h1>SignIn</h1>
          <div className="social-container">
            <a href="#" className="social">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="#" className="social">
              <FontAwesomeIcon icon={faGoogle}/>
            </a>
            <a href="#" className="social">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </div>
        <input type="email" placeholder='Username' value={username} onChange={handleUsernameChange}/>
        <button className="button-53" onClick={handleLogin}>SignIn</button>
      </form>
    </div>
    <div className="overlay-container">
      <div className="overlay">
        <div className="overlay-panel overlay-left">
          <h1>WelcomeBack</h1>
          <p>LoginPersonalInfo</p>
          <button className="button-53" id="signIn" onClick={changeDisplay}>
          SignIn
          </button>
        </div>
        <div className="overlay-panel overlay-right">
          <h1> HelloFriend</h1>
          <p>PersonalDetails</p>
          <button className="button-53" id="signUp" onClick={changeDisplay}>
          SignUp
          </button>
        </div>
      </div>
    </div>
  </div>
  );
};


export default HomePage;
