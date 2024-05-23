import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { handleGetAllImages, handleGetAllRatings, handleGetImageRatings } from '../services/adminService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPage.css';

/*
row data example
  {
    imageId: 1,
    userId: 1,
    rating: 4.5,
    type: 'landscape',
    submittedFrom: 'web',
    updatedAt: '2022-01-01',
  }
];

image data example
  {
    id: 1,
    imageName: 'image1',
    imageCategory: 'landscape',
    imageData: 'base64',
  }
*/
const AdminPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState('');
  const [images, setImages] = useState([]);

  const fetchImages = async () => {
    handleGetAllImages("adminnnnnn@gmail.com").then((response) => {
      console.log(response);
      setImages(response.images);
    });
  };

  const fetchAllRatings = async () => {
    handleGetAllRatings("adminnnnnn@gmail.com").then((response) => {
      setData(response.ratings);
    });
  };

  const fetchRatingsByImageId = async () => {
    handleGetImageRatings("adminnnnnn@gmail.com", selectedImageId).then((response) => {
      setData(response.ratings);
    });
  };

  useEffect(() => {
    fetchImages();
    fetchAllRatings();
  }, []);

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    return date.toLocaleDateString(undefined, options);
  };

  const getImageDetails = (imageId) => {
    const image = images.find(img => img.id === imageId);
    return image ? { imageName: image.imageName, imageCategory: image.imageCategory } : { imageName: '', imageCategory: '' };
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">{t("adminPageTitle")}</h1>
      <div className="mb-3 d-flex align-items-center">
        <button className="btn btn-primary me-2" onClick={fetchAllRatings}>
          {t("AllRatings")}
        </button>
        <select
          className="form-select me-2"
          value={selectedImageId}
          onChange={(e) => setSelectedImageId(e.target.value)}
        >
          <option value="">{t("selectImageId")}</option>
          {images.map((item) => (
            <option key={item.id} value={item.id}>
              {item.imageName} - {item.imageCategory}
            </option>
          ))}
        </select>
        <button
          className="btn btn-secondary"
          onClick={fetchRatingsByImageId}
          disabled={!selectedImageId}
        >
          {t("fetchRatings")}
        </button>
      </div>
      <div className="table-responsive table-wrapper">
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>{t("imageColumn")}</th>
              <th>{t("imageNameColumn")}</th>
              <th>{t("imageCategoryColumn")}</th>
              <th>{t("userIdColumn")}</th>
              <th>{t("ratingColumn")}</th>
              <th>{t("typeColumn")}</th>
              <th>{t("submittedFromColumn")}</th>
              <th>{t("updatedAtColumn")}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const { imageName, imageCategory } = getImageDetails(item.imageId);
              return (
                <tr key={index}>
                  <td>{item.imageId}</td>
                  <td>{imageName}</td>
                  <td>{imageCategory}</td>
                  <td>{item.userId}</td>
                  <td>{item.rating}</td>
                  <td>{item.type}</td>
                  <td>{item.submittedFrom}</td>
                  <td>{parseDate(item.updatedAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
