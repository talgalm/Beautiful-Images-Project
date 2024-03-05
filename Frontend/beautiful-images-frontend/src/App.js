import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './App.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPgae/LandingPage';

function App() {
  const { t } = useTranslation();

  return (
    <div className="App">
      <h1>{t('welcome')}</h1>
      <LanguageSwitcher/>
      <LandingPage/>
    </div>
  );
}

export default App;