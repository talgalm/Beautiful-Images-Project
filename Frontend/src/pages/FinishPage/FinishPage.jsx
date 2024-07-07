import "./finishPage.css";
import { useTranslation, Trans } from "react-i18next";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { Modal } from "react-bootstrap";
import { countries } from "../HomePage/hebrewCountries.js";

export default function FinishPage() {
  const { t, i18n } = useTranslation();
  const isRtl = ["he"].includes(i18n.language);
  const navigate = useNavigate();
  const [infoModal, setInfoModal] = useState(false);
  const Countries = countries.map((item) => item);
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      navigate("/home");
    }
  }, []);

  const backHome = () => {
    navigate("/");
  };

  const closeModal = () => {
    setInfoModal(false);
  };
  const openModal = () => {
    setInfoModal(true);
  };
  function handleCountryChange(event) {
    setCountry(event.target.value);
  }
  function handleAgeChange(event) {
    setAge(event.target.value);
  }
  function handleGenderChange(event) {
    setGender(event.target.value);
  }

  return (
    <div className="header-wrapper">
      <Header />
      <div
        className="finish-div"
        style={{ textAlign: isRtl ? "right" : "left" }}
      >
        <div
          className="thank-you-div"
          style={{ flexDirection: isRtl ? " row-reverse" : "row" }}
        >
          {t("finishExperiment1")}
        </div>
        <div
          className="thank-you-div"
          style={{ flexDirection: isRtl ? " row-reverse" : "row" }}
        >
          {t("finishExperiment2")}
        </div>
        <div
          className="thank-you-div"
          style={{ flexDirection: isRtl ? " row-reverse" : "row" }}
        >
          <div
            className=""
            style={{ flexDirection: isRtl ? " row-reverse" : "row" }}
          >
            {t("finishExperiment3")}
          </div>
          <div className="survey-link">
            <a
              href={
                isRtl
                  ? "https://forms.gle/LDq3cfZp78qvzCBa7"
                  : "https://forms.gle/ztBNC4RSCbFpwcJz7"
              }
              target="_blank"
              rel="noreferrer"
              dir={isRtl ? "rtl" : "ltr"}
            >
              {t("finishExperiment4")}
            </a>
          </div>
        </div>
        <div
          className="thank-you-div"
          style={{ flexDirection: isRtl ? " row-reverse" : "row" }}
        >
          {t("finishExperiment5")}
          <div className="survey-link">
            <a
              onClick={openModal}
              style={{ cursor: "pointer" }}
              dir={isRtl ? "rtl" : "ltr"}
            >
              {isRtl ? t("finishExperiment4") : "Here."}
            </a>
          </div>
          {isRtl && t("finishExperiment6")}
        </div>
        <div
          className="thank-you-div"
          style={{ flexDirection: isRtl ? " row-reverse" : "row" }}
        >
          {!isRtl && t("finishExperiment6")}
        </div>
        <button className="button-53" onClick={backHome}>
          {t("backHome")}
        </button>
      </div>
      <Modal show={infoModal} onHide={closeModal} size="l">
        <Modal.Header closeButton>
          <div className="update-header-div">{t("updateHeader")}</div>
        </Modal.Header>
        <Modal.Body>
          <div className="update-div">
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
              placeholder={t("updateAge")}
              value={age}
              onChange={handleAgeChange}
              style={{ direction: isRtl ? "rtl" : "lft" }}
            ></input>
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
          </div>
          <div
            className="button-update"
            style={{ justifyContent: isRtl ? "flex-start" : "flex-end" }}
          >
            <button className="button-53" onClick={closeModal}>
              {t("update")}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
