import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './App.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import HomePage from './pages/HomePage/HomePage';
import LandingPage from './pages/LandingPgae/LandingPage';
import Header from './components/Header/Header';
import 'drag-drop-touch'; 

function App() {
  const { t } = useTranslation();

  return (
    <div className="App">
      <Header/>
      <LandingPage/>
    </div>
  );
}

export default App;