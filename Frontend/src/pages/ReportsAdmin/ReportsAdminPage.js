import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { handleGetCsvRatings, handleGetCsvImages, handleGetCsvUsers, handleGetPdfReport } from '../../services/adminService';
import Header from '../../components/Header/Header';

export default function ReportsAdminPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigateToAdminPage = () => {
    navigate("/admin");
  }
  return (
    <div>
      <Header/>
      <div className="container mt-4">
      <h1 className="mb-4">{t('reports')}</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '200px' }}>
        <button onClick={()=>handleGetCsvRatings()}>ratings csv</button>
        <button onClick={()=>handleGetCsvImages()}>images csv</button>
        <button onClick={()=>handleGetCsvUsers()}>users csv</button>
        <button onClick={()=>handleGetPdfReport()}>pdf</button>
        <button onClick={handleNavigateToAdminPage}>back</button>
      </div>
    </div>
    </div>
  );
};
