import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import "./homePage.css";
import {
  handleUserLogin,
  handleUserRegistration,
} from "../../services/userService";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { countries } from "../HomePage/hebrewCountries.js";
import { handleAdminLogin } from "../../services/adminService";
import { Card, Modal } from "react-bootstrap";

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const [isSignUpActive, setSignUpActive] = useState(false);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [countryEnglishName, setCountryEnglishName] = useState("");
  const [error, setError] = useState(undefined);
  const [errorInRegistration, setInRegistraion] = useState("");
  const [adminView, setAdminView] = useState(false);
  const [password, setPassword] = useState("");
  const emailInputRef = useRef(null);
  const emailInputRef2 = useRef(null);

  const navigate = useNavigate();
  const mobileScreen = window.innerWidth <= 431;
  const isRtl = ["he"].includes(i18n.language);
  const Countries = countries.map((item) => item);

  function changeDisplay() {
    isSignUpActive
      ? emailInputRef.current.focus()
      : emailInputRef2.current.focus();
    setSignUpActive(!isSignUpActive);
    setAge("");
    setEmail("");
    setEmailConfirm("");
    setNickname("");
    setGender("");
    setCountry("");
  }

  function handleUsernameChange(event) {
    setError("");
    setInRegistraion("");
    setEmail(event.target.value);
  }
  function handleUsernameConfirmChange(event) {
    setInRegistraion("");
    setEmailConfirm(event.target.value);
  }

  function handleNickname(event) {
    setNickname(event.target.value);
  }

  function handleAgeChange(event) {
    setInRegistraion("");
    setAge(event.target.value);
  }
  function handleGenderChange(event) {
    setGender(event.target.value);
  }
  function handleCountryChange(event) {
    const chosenCountryName = event.target.value;
    setCountry(chosenCountryName);

    countries.find((country) => {
      if (
        country.name === chosenCountryName ||
        country.english_name == chosenCountryName
      )
        setCountryEnglishName(country.english_name);
    });
  }

  function handleRegistration(event) {
    event.preventDefault();
    const isEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/i.test(
      email
    );
    const matchingEmail = emailConfirm === email;
    const agePattern = /^\d*$/;
    const ageNum = parseInt(age);
    let isAge = true;
    if (!agePattern.test(age) && age != "") {
      setInRegistraion("AgeMustContainOnlyNumbers");
      isAge = false;
    } else if (age && (age === "" || ageNum < 18 || ageNum > 99)) {
      if (!(ageNum >= 18 && ageNum <= 99)) {
        setInRegistraion("AgeMustBeBetween1899");
      } else {
        isAge = false;
      }
    } else if (!isEmail) {
      setInRegistraion("invalidEmail");
    } else if (!matchingEmail) {
      setInRegistraion("emailsDontMatch");
    } else if (isEmail && matchingEmail) {
      handleUserRegistration(
        email,
        nickname,
        age === "" ? 0 : age,
        countryEnglishName,
        gender
      )
        .then((data) => {
          console.log(data.message);
          if (data.message === "User registered successfully") {
            localStorage.setItem("nowRegistered", "true");
            handleLogin(event);
          } else {
            setInRegistraion(data.message.replace(/\s/g, ""));
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
    }
  }
  function handleLogin(event) {
    event.preventDefault();
    if (email.includes("admin@gmail.com")) {
      openModal();
    } else {
      handleUserLogin(email)
        .then((data) => {
          if (data.message === "Login successful" && data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("email", email);
            localStorage.setItem("nickname", data.nickname);
            navigate("/instructions");
          } else {
            if (data.message === "Email does not exist") setError(data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  function handleAdmin() {
    handleAdminLogin(email, password)
      .then((data) => {
        if (data.message === "Login successful" && data.token) {
          navigate("/admin/participants");
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError("Login failed. Please try again.");
      });
  }

  const openModal = () => {
    setAdminView(true);
  };
  const closeModal = () => {
    setAdminView(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  return (
    <div className="all">
      <div className="header-wrapper">
        <Header />

        <div
          className={`container ${isSignUpActive ? "right-panel-active" : ""}`}
          id="container"
        >
          <div className="form-container sign-up-container">
            <form action="#" className="form-2">
              <h1>{t("createAccount")}</h1>
              <input
                required
                type="input"
                placeholder={t("enterUsername")}
                value={email}
                onChange={handleUsernameChange}
                dir={isRtl ? "rtl" : "ltr"}
                className={errorInRegistration ? "err-div" : ""}
                ref={emailInputRef2}
              />
              <input
                required
                type="input"
                placeholder={t("enterUsernameConfirm")}
                value={emailConfirm}
                onChange={handleUsernameConfirmChange}
                dir={isRtl ? "rtl" : "ltr"}
                className={errorInRegistration ? "err-div" : ""}
              />
              <input
                type="input"
                placeholder={t("enterNickname")}
                value={nickname}
                onChange={handleNickname}
                dir={isRtl ? "rtl" : "ltr"}
              />
              <select
                value={gender}
                onChange={handleGenderChange}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <option value="" disabled>
                  {t("enterGender")}
                </option>
                <option value="male">{t("Male")}</option>
                <option value="female">{t("Female")}</option>
                <option value="other">{t("Other")}</option>
              </select>
              <select
                value={country}
                onChange={handleCountryChange}
                dir={isRtl ? "rtl" : "ltr"}
              >
                <option value="">{t("selectCountry")}</option>
                {isRtl
                  ? Countries.map((obj) => obj.name).map((country, index) => (
                      <option key={index} value={country}>
                        {country}
                      </option>
                    ))
                  : Countries.map((obj) => obj.english_name)
                      .sort()
                      .map((country, index) => (
                        <option key={index} value={country}>
                          {country}
                        </option>
                      ))}
              </select>
              <input
                placeholder={t("age")}
                value={age}
                onChange={handleAgeChange}
                dir={isRtl ? "rtl" : "ltr"}
                className={
                  errorInRegistration
                    ? age != "" && !(age >= 18 && age <= 99)
                      ? "err-div"
                      : ""
                    : ""
                }
              />
              {errorInRegistration !== "" && (
                <span
                  style={{
                    color: "red",
                    height: "25px",
                    width: "100%",
                    fontSize: "15px",
                  }}
                >
                  {t(errorInRegistration)}
                </span>
              )}
              {errorInRegistration === "Userwiththisemailalreadyexists" && (
                <span
                  style={{
                    color: "red",
                    height: "25px",
                    width: "100%",
                    fontSize: "12px",
                    marginBottom: "-20px",
                  }}
                >
                  {t("emailExistsNote")}
                </span>
              )}
              <button
                className="button-53"
                onClick={handleRegistration}
                style={{ marginBottom: "-50px", marginTop: "5px" }}
              >
                {t("signUp")}
              </button>
            </form>
          </div>
          <div className="form-container sign-in-container">
            <form action="#" className="form-1">
              <h1 className="h1-sign">{t("signIn")}</h1>
              <input
                required
                type="input"
                placeholder={t("enterUsername")}
                className={error ? "form-1-sign-error" : "form-1-sign"}
                value={email}
                onChange={handleUsernameChange}
                dir={isRtl ? "rtl" : "ltr"}
                ref={emailInputRef}
              />
              <span
                style={{
                  color: "red",
                  height: "25px",
                  width: "100%",
                  fontSize: "15px",
                }}
              >
                {t(error)}
              </span>
              <button className="button-53" onClick={handleLogin}>
                {t("continue")}
              </button>
              {/* <button className="button-53" onClick={handleAdminLogin}>{t('adminLogin')}</button> */}
            </form>
          </div>
          <div className="overlay-container">
            {!mobileScreen && (
              <div className="overlay">
                <div className="overlay-panel overlay-left">
                  <h1 className="h1-over-l">{t("welcomeBack")}</h1>
                  <p className="p-over-l">{t("loginHere")}</p>
                  <button
                    className="button-53"
                    id="signIn"
                    onClick={changeDisplay}
                  >
                    {t("login")}
                  </button>
                </div>
                <div className="overlay-panel overlay-right">
                  <h1 className="h1-over-r"> {t("helloFriend")}</h1>
                  <p className="p-over-r"> {t("firstTime")}</p>
                  <button
                    className="button-53"
                    id="signUp"
                    onClick={changeDisplay}
                  >
                    {t("signUp")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {mobileScreen && (
        <div className="button-in-mobile">
          <button className="button-53" id="signUp" onClick={changeDisplay}>
            {isSignUpActive ? t("signInMobile") : t("signUpMobile")}
          </button>
        </div>
      )}
      <Modal show={adminView} onHide={closeModal} size="l">
        <Modal.Header closeButton style={{ color: "black" }}>
          {" "}
          <div className="update-header-div">{t("enterPassAdmin")}</div>
        </Modal.Header>
        <Modal.Body>
          <div>
            <input
              required
              type="input"
              placeholder={t("enterPassAdmin")}
              value={password}
              onChange={handlePasswordChange}
              dir={isRtl ? "rtl" : "ltr"}
            />
            <button className="button-53" onClick={handleAdmin}>
              {t("continue")}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
