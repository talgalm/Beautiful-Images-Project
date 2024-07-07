import React from "react";
import { Link } from "react-router-dom";
import { Button } from "react-bootstrap";
import "./App.css";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/LanguageSwitcher";
import HomePage from "./pages/HomePage/HomePage";
import LandingPage from "./pages/LandingPgae/LandingPage";
import Header from "./components/Header/Header";
import "drag-drop-touch";
import AutoLogoutWrapper from "../src/hooks/AutoLogoutWrapper";

function App() {
  const { t } = useTranslation();

  return (
    <AutoLogoutWrapper>
      <div className="App">
        <Header />
        <LandingPage />
      </div>
    </AutoLogoutWrapper>
  );
}

export default App;
