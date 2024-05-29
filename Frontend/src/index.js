import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import App from './App';

import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';


import HomePage from './pages/HomePage/HomePage';
import RatingPage from './pages/RatingPage/RatingPage';
import ImagesPage from './pages/ImagesPage/ImagesPage';
import AdminPage from './pages/adminPage/AdminPage';
import ImagesAdminPage from './pages/ImagesAdmin/ImagesAdminPage';

import InstructionsPage from './pages/InstructionsPage/InstructionsPage';
import FinishPage from './pages/FinishPage/FinishPage';
import ReportsAdminPage from './pages/ReportsAdmin/ReportsAdminPage';
import AdminLoginPage from './pages/AdminLoginPage';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <I18nextProvider i18n={i18n}>
  <Router>
    <Routes>
      <Route exact path="/" element={<App/>} />
      <Route path="/home" element={<HomePage/>} />
      <Route path="/images" element={<ImagesPage/>} />
      <Route path="/rating" element={<RatingPage/>} />
      <Route path="/admin" element={<AdminPage/>} />
      <Route path="/admin/images" element={<ImagesAdminPage/>} />
      <Route path="/admin/reports" element={<ReportsAdminPage/>} />
      <Route path="/adminLogin" element={<AdminLoginPage/>} />
      <Route path="/instructions" element={<InstructionsPage/>} />
      <Route path="/finish" element={<FinishPage/>} />
    </Routes>
  </Router>
  </I18nextProvider>
);