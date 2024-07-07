import { useTranslation, Trans } from "react-i18next";
import "./landingPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { handleGetParticipantsData } from "../../services/adminService";

export default function LandingPage() {
  const { t, i18n } = useTranslation();
  const isRtl = ["he"].includes(i18n.language);
  const [isChecked, setIsChecked] = useState(false);
  const [isOK, setIsOK] = useState(false);
  const [isOKContinute, setIsOKContinute] = useState(false);

  const [num, setNum] = useState(0);

  useEffect(() => {
    handleGetParticipantsData()
      .then((data) => {
        setNum(data.participants.length);
      })
      .catch((error) => {
        console.error("Error :", error);
      });
  }, []);

  const navigate = useNavigate();

  useEffect(() => {}, []);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
    setIsOKContinute(false);
  };

  const handleButtonClick = () => {
    if (!isOK) {
      setIsOK(true);
    } else {
      if (isChecked && !isOKContinute) {
        navigate("/home");
      } else {
        setIsOKContinute(true);
      }
    }
  };
  const handleButtonClickRegistered = () => {
    navigate("/home");
  };

  return (
    <div className="landing-div">
      <div
        className="instructions-div"
        style={{
          textAlign: isRtl ? "right" : "left",
          direction: isRtl ? "rtl" : "ltr",
        }}
      >
        {true && (
          <div className="text-div">
            <p className="p-intro">{t("landingTitle")}</p>
            <p className="p-subtitle">{t("landingSubTitle")}</p>
            <p className="p-text">{t("landingPart1")}</p>
            <p className="p-text">{t("landingPart2")}</p>
            {!isOK && <p className="p-text">{t("landingPart3")} </p>}
            {!isOK && (
              <div className="num-count">
                <div>{num}</div> <div>{t("landingNum")} </div>
              </div>
            )}
            {isOK && <p className="p-text">{t("landingPartContinute")}</p>}
          </div>
        )}

        {isOK && (
          <div className="text-div-con">
            {
              <div>
                <p className="p-text-in-title">{t("landingSubHeadline1")}</p>
                <p className="p-text-in-sub">{t("landingSubText1")}</p>
                <p className="p-text-in-title">{t("landingSubHeadline2")}</p>
                <p className="p-text-in-sub">{t("landingSubText2")}</p>
                <p className="p-text-in-title">{t("landingSubHeadline3")}</p>
                <p className="p-text-in-sub">{t("landingSubText3")}</p>
                <p className="p-text-in-title">{t("landingSubHeadline4")}</p>
                <p className="p-text-in-sub">{t("landingSubText4")}</p>
                <p className="p-text-in-title">{t("landingSubHeadline5")}</p>
                <p className="p-text-in-sub">{t("landingSubText5")}</p>
                <p className="p-text-in-title">{t("landingSubHeadline6")}</p>
                <p className="p-text-in-sub">{t("landingSubText6")}</p>
                <p className="p-text-in-title">{t("landingSubHeadline7")}</p>
                <p className="p-text-in-sub">{t("landingSubText7")}</p>
                <p className="p-text-in-title">{t("landingSubHeadline8")}</p>
                <p className="p-text-in-sub">{t("landingSubText8")}</p>
              </div>
            }
            <div
              className="checkbox-ok-div"
              style={{
                flexDirection: isRtl ? "row-reverse" : "row",
                justifyContent: isRtl ? "flex-end" : "flex-start",
              }}
            >
              {!isRtl ? (
                <>
                  <input
                    type="checkbox"
                    id="myCheckbox"
                    name="myCheckbox"
                    className="myCheckbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label
                    className="l-1"
                    htmlFor="myCheckbox"
                    style={{
                      marginLeft: "20px",
                      direction: isRtl ? "rtl" : "ltr",
                    }}
                  >
                    {t("checkboxAgreeExp")}
                  </label>
                </>
              ) : (
                <>
                  <label
                    className="l-1"
                    htmlFor="myCheckbox"
                    style={{
                      marginRight: "10px",
                      direction: isRtl ? "rtl" : "ltr",
                    }}
                  >
                    {t("checkboxAgreeExp")}
                  </label>
                  <input
                    type="checkbox"
                    id="myCheckbox"
                    name="myCheckbox"
                    className="myCheckbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                </>
              )}
            </div>
            {isOKContinute ? (
              <div style={{ color: "red", margin: "10px 0px 40px 40px" }}>
                {t("checkToAgree")}
              </div>
            ) : (
              <div
                style={{
                  height: "25px",
                  width: "100%",
                  backgroundColor: "white",
                  color: "white",
                }}
              >
                {t("checkToAgree").replace("s", " ")}
              </div>
            )}
          </div>
        )}
        <div
          className="buttons-div"
          style={{
            alignItems: isRtl ? "flex-start" : "flex-end",
            justifyContent: isRtl ? "center" : "center",
          }}
        >
          <button className="button-c" onClick={handleButtonClick}>
            {t("continue")}
          </button>
          {!isOK && (
            <button className="button-c" onClick={handleButtonClickRegistered}>
              {t("RegisteredUsers")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
