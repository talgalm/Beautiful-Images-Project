import React from 'react';
import Header from '../../components/Header/Header';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import AdminNavBar from '../../components/AdminNavBar/adminNavBar';


export default function AdminHubPage (){
  const { t } = useTranslation();
  const navigate = useNavigate();


  return (
    <div>
      <Header />
      <AdminNavBar />
      <div className='header'>
        <button
          className="btn btn-primary m-1"
          onClick={() => navigate("/admin/ratings")}
        >
          {t("ratingsManage")}
        </button>
        <button
          className="btn btn-primary m-1"
          onClick={() => navigate("/admin/images")}
          >
          {t('imageManage')}
        </button>
        <button
            className="btn btn-primary m-1"
            onClick={() => navigate("/admin/participants")}
          >
          {t('participants')}
        </button>
        <button
          className="btn btn-primary m-1"
          onClick={() => navigate("/admin/reports")}
          >
          {t('reports')}
        </button>
      </div>
    </div>
  );
};
