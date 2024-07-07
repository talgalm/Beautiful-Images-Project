import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./adminNavBar.css";

const AdminNavBar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container nav-container d-flex justify-content-center">
        <ul className="navbar-nav">
          <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              onClick={() => navigate("/admin/participants")}
            >
              {t("participants")}
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              onClick={() => navigate("/admin/ratings")}
            >
              {t("ratingsManage")}
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              onClick={() => navigate("/admin/images")}
            >
              {t("imageManage")}
            </button>
          </li>
          <li className="nav-item">
            <button
              className="nav-link btn btn-link"
              onClick={() => navigate("/admin/reports")}
            >
              {t("reports")}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default AdminNavBar;
