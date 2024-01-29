import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './App.css';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';

function App() {
  const { t } = useTranslation();

  return (
    <div className="App">
      <h1>{t('welcome')}</h1>
      <nav>
        <Button variant="primary"><Link to="/home" className="text-light">{t('home')}</Link></Button>{' '}
        <Button variant="primary"><Link to="/login" className="text-light">{t('login')}</Link></Button>{' '}
        <Button variant="primary"><Link to="/images" className="text-light">{t('images')}</Link></Button>{' '}
        <Button variant="primary"><Link to="/rating" className="text-light">{t('rating')}</Link></Button>{' '}
        <Button variant="primary"><Link to="/admin" className="text-light">{t('admin')}</Link></Button>{' '}
      </nav>
      <LanguageSwitcher/>
    </div>
  );
}

export default App;