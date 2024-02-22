import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RatingPage from './pages/RatingPage';

import ImagesPage from './pages/ImagesPage';
import AdminPage from './pages/AdminPage';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <I18nextProvider i18n={i18n}>
  <Router>
    <Routes>
      <Route exact path="/" element={<App/>} />
      <Route path="/home" element={<HomePage/>} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/images" element={<ImagesPage/>} />
      <Route path="/rating" element={<RatingPage/>} />
      <Route path="/admin" element={<AdminPage/>} />
    </Routes>
  </Router>
  </I18nextProvider>
);