import { useTranslation } from "react-i18next";
import "./header.css";
import LanguageSwitcher from "../LanguageSwitcher";
import { Modal } from "react-bootstrap";
import { useState } from "react";
import userIcon from "./user-icon.png";
import logo from "./u-logo.webp";
import { useLocation } from "react-router-dom";
import { handleUserLogout } from "../../services/userService";
import { useNavigate } from "react-router-dom";
import { isMobile } from "react-device-detect";

export default function Header() {
  const [showLogout, setShowlogout] = useState(false);
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const isRtl = ["he"].includes(i18n.language);
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const location = useLocation();

  const isHomeOrRoot = () => {
    return location.pathname === "/" || location.pathname === "/home";
  };

  function handleLogout() {
    handleUserLogout()
      .then((data) => {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        localStorage.removeItem("expireTime");
        navigate("/home");
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  const closeFinishModal = () => {
    setShowlogout(false);
  };
  const openFinishModal = () => {
    setShowlogout(true);
  };

  return (
    <div className="header-div">
      <img
        className="logo"
        src={logo}
        alt="Logo"
        style={{
          height: "90%",
          marginTop: "8px",
        }}
      />
      <div className="icons-div">
        <div className="icon-panel" style={{ right: "20px" }}>
          <LanguageSwitcher />
          {!isHomeOrRoot() && (
            <div>
              <div className="tooltip-container">
                <img src={userIcon} onClick={openFinishModal}></img>
                <span className="tooltip-text">{t("logoutOption")}</span>
              </div>
            </div>
          )}
          {/* {!isMobile && localStorage.getItem('nickname') !== null && <div className="nick" dangerouslySetInnerHTML={{
              __html: t("greet",
                { name: localStorage.getItem('nickname')}
              ),
            }}></div>} */}
        </div>
      </div>
      <Modal show={showLogout} onHide={closeFinishModal} size="l">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="logout-div" dir={isRtl ? "rtl" : "ltr"}>
            <h1>{t("logout")}</h1>
            <button className="button-53" onClick={handleLogout}>
              {t("logoutButton")}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
