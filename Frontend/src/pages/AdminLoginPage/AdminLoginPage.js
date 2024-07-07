import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { handleAdminLogin } from "../../services/adminService";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import "./adminLoginPage.css";

const AdminLoginPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleAdminLoginHelper = (event) => {
    event.preventDefault();
    setEmailError("");
    setLoginError("");

    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }

    handleAdminLogin(email, password)
      .then((data) => {
        if (data.message === "Login successful" && data.token) {
          navigate("/admin");
        } else {
          setLoginError(data.message);
        }
      })
      .catch((error) => {
        setLoginError("Login failed. Please try again.");
      });
  };

  return (
    <div>
      <Header />
      <div className="center-div">
        <div>
          <form onSubmit={handleAdminLoginHelper} className="box-div">
            <h1 className="head-div" style={{ color: "black" }}>
              {t("adminLogin")}
            </h1>
            <div className="form-group">
              <input
                type="text"
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                id="email"
                placeholder={t("enterUsername")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <div className="invalid-feedback">{emailError}</div>
              )}
            </div>
            <div className="form-group">
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder={t("enterPassword")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="button-div">
              <button
                className="btn btn-primary"
                onClick={() => navigate("/home")}
              >
                {t("back")}
              </button>
              <button type="submit" className="btn btn-primary">
                {t("login")}
              </button>
            </div>

            {loginError && (
              <div className="alert alert-danger mt-3">{loginError}</div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
