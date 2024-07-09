import React from "react";
import { useTranslation } from "react-i18next";
import {
  handleGetCsvRatings,
  handleGetCsvImages,
  handleGetCsvUsers,
  handleGetCsvCategories,
  handleGetPdfReport,
} from "../../services/adminService";
import Header from "../../components/Header/Header";
import AdminNavBar from "../../components/AdminNavBar/adminNavBar";

export default function ReportsAdminPage() {
  const { t } = useTranslation();

  return (
    <div>
      <Header />
      <AdminNavBar />
      <div className="container mt-4">
        <h1 className="mb-4">{t("reports")}</h1>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            maxWidth: "200px",
          }}
        >
          <button onClick={() => handleGetCsvRatings()}>ratings csv</button>
          <button onClick={() => handleGetCsvImages()}>images csv</button>
          <button onClick={() => handleGetCsvUsers()}>users csv</button>
          <button onClick={() => handleGetCsvCategories()}>categories csv</button>
          <button onClick={() => handleGetPdfReport()}>pdf</button>
        </div>
      </div>
    </div>
  );
}
