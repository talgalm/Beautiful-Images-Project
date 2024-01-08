import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './index.css';
import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ImagesPage from './pages/ImagesPage';
import RatingPage from './pages/RatingPage';
import AdminPage from './pages/AdminPage';

import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
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
);