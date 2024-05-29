import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { handleGetAllImages, handleGetAllRatings, handleGetImageRatings } from '../services/adminService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminPage.css';

import { Card , Modal} from 'react-bootstrap';
import Header from '../components/Header/Header';
import { useNavigate } from 'react-router-dom';
import { handleFetchSingleImage } from '../services/userService';

const AdminPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImageId, setSelectedImageId] = useState('');
  const [images, setImages] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const fetchImages = async () => {
    handleGetAllImages("adminnnnnn@gmail.com").then((response) => {
      setImages(response.images);
    });
  };

  const moveToMan = () => {
    navigate("/admin/images");
  }

  const handleNavigateToReportsPage = () => {
    navigate("/admin/reports");
  }

  const fetchRatings = async () => {
    if (selectedImageId) {
      handleGetImageRatings("adminnnnnn@gmail.com", selectedImageId).then((response) => {
        setData(response.ratings);
      });
    } else if (selectedCategory) {
      const categoryImageIds = images
        .filter(image => image.imageCategory === selectedCategory)
        .map(image => image.id);
      
      const allCategoryRatings = [];
      for (const imageId of categoryImageIds) {
        const response = await handleGetImageRatings("adminnnnnn@gmail.com", imageId);
        allCategoryRatings.push(...response.ratings);
      }
      setData(allCategoryRatings);
    } else {
      handleGetAllRatings("adminnnnnn@gmail.com").then((response) => {
        setData(response.ratings);
      });
    }
  };

  useEffect(() => {
    fetchImages();
    fetchRatings();
  }, []);

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
    return date.toLocaleDateString(undefined, options);
  };

  const categories = [...new Set(images.map(img => img.imageCategory))];
  const filteredImages = images.filter(img => img.imageCategory === selectedCategory);

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    console.log('Sorting by:', key, direction);

    const sortedData = [...data].sort((a, b) => {
      if (a[key] < b[key]) {
        return direction === 'asc' ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    setData(sortedData);
  };

  const sortIndicator = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼';
    }
    return null;
  };



  const openModal =(img) => {
    handleFetchSingleImage(img.imageId , 'original')
    .then(data => { 
      setSelectedImage(data.image.imageData)
      setShowModal(true);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
    setShowModal(true)
  }
  const closeModal =() => {
    setShowModal(false)
  }


  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h1 className="mb-4">{t("adminPageTitle")}</h1>
        <div className="mb-3 d-flex align-items-center">
          <select
            className="form-select me-2 small-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedImageId(''); // Reset selected image when category changes
            }}
          >
            <option value="">{t("selectCategory")}</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            className="form-select me-2 small-select"
            value={selectedImageId}
            onChange={(e) => setSelectedImageId(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">{t("selectImageId")}</option>
            {filteredImages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.imageName} - {item.imageCategory}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary"
            onClick={fetchRatings}
          >
            {t("fetchRatings")}
          </button>
          <button
            className="btn btn-primary"
            onClick={moveToMan}
          >
           Images Managenent
          </button>

          <button
            className="btn btn-primary"
            onClick={handleNavigateToReportsPage}
          >
           Reports
          </button>
        </div>
        <div className="table-responsive table-wrapper">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th onClick={() => sortData('imageId')}>
                  {t("imageIdColumn")} {sortIndicator('imageId')}
                </th>
                <th>{t("imageIconColumn")}</th>
                <th onClick={() => sortData('imageName')}>
                  {t("imageNameColumn")} {sortIndicator('imageName')}
                </th>
                <th onClick={() => sortData('imageCategory')}>
                  {t("imageCategoryColumn")} {sortIndicator('imageCategory')}
                </th>
                <th onClick={() => sortData('userId')}>
                  {t("userIdColumn")} {sortIndicator('userId')}
                </th>
                <th onClick={() => sortData('rating')}>
                  {t("ratingColumn")} {sortIndicator('rating')}
                </th>
                <th onClick={() => sortData('type')}>
                  {t("typeColumn")} {sortIndicator('type')}
                </th>
                <th onClick={() => sortData('submittedFrom')}>
                  {t("submittedFromColumn")} {sortIndicator('submittedFrom')}
                </th>
                <th onClick={() => sortData('updatedAt')}>
                  {t("updatedAtColumn")} {sortIndicator('updatedAt')}
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => {
                return (
                  <tr key={index}>
                    <td>{item.imageId}</td>
                    <td>
                      <Card.Img
                        className="imageCard"
                        src={`data:image/jpeg;base64,${images.find(img => img.id === item.imageId)?.imageData}`}
                        style={{ maxWidth: '60px', maxHeight: '60px' }}
                        onClick={() => openModal(item)}
                      />
                    </td>
                    <td>{item.imageName}</td>
                    <td>{item.imageCategory}</td>
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
      <Modal show={showModal} onHide={closeModal} size="xl" >
                    <Modal.Header closeButton>
                    </Modal.Header>
                    <Modal.Body>
                    {selectedImage && (
                        <div className="modal-card-div">
                            <Card>
                                <Card.Img variant="top" src={`data:image/jpeg;base64,${selectedImage}`} />
                            </Card>

                        </div>
                        )
                    }
                    </Modal.Body>
                </Modal>
    </div>
  );
};

export default AdminPage;
