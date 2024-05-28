import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGetCsvRatings, handleGetCsvImages, handleGetCsvUsers, handleGetPdfReport } from '../../services/adminService';

export default function ReportsAdminPage() {
  const navigate = useNavigate();

  const handleNavigateToAdminPage = () => {
    navigate("/admin");
  }
  return (
    <div style={{ padding: '20px' }}>
      <h1>Reports Admin Page</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '200px' }}>
        <button onClick={()=>handleGetCsvRatings()}>ratings csv</button>
        <button onClick={()=>handleGetCsvImages()}>images csv</button>
        <button onClick={()=>handleGetCsvUsers()}>users csv</button>
        <button onClick={()=>handleGetPdfReport()}>pdf</button>
        <button onClick={handleNavigateToAdminPage}>back</button>
      </div>
    </div>
  );
};
