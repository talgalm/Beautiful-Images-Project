import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "react-bootstrap";
import "./languages.css";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const isRtl = ["he"].includes(i18n.language);
  const [lang, setLang] = useState(t("langugaes"));

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    if (language === "en") setLang("En");
    if (language === "he") setLang("עברית");
  };

  return (
    <div className="flags-div" dir={isRtl ? "rtl" : "ltr"}>
      <Dropdown>
        <Dropdown.Toggle id="dropdown-basic">{lang}</Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1" onClick={() => changeLanguage("en")}>
            <img
              alt="United States"
              src="http://purecatamphetamine.github.io/country-flag-icons/3x2/US.svg"
            />
            <a>{t("En")}</a>
          </Dropdown.Item>
          <Dropdown.Item href="#/action-1" onClick={() => changeLanguage("he")}>
            <img
              alt="Israel"
              src="http://purecatamphetamine.github.io/country-flag-icons/3x2/IL.svg"
            />
            <a>{t("He")}</a>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default LanguageSwitcher;
