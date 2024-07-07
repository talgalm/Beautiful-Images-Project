import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { handleGetAllImages, handleGetImageRatings, handleGetRatingsPaginated } from '../../services/adminService';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminRatingsPage.css';

import { Card, Modal } from 'react-bootstrap';
import Header from '../../components/Header/Header';
import { handleFetchSingleImage } from '../../services/userService';
import AdminNavBar from '../../components/AdminNavBar/adminNavBar';

const AdminRatingsPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedImageId, setSelectedImageId] = useState('');
  const [images, setImages] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(40);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = async () => {
    handleGetAllImages("admin@gmail.com").then((response) => {
      setImages(response.images);
    });
  };

  const showPagination = () => {
    return selectedCategory === '' && selectedImageId === '';
  };

  const fetchRatings = async () => {
    if (selectedImageId) {
      handleGetImageRatings("admin@gmail.com", selectedImageId).then((response) => {
        setData(response.ratings);
      });
    } else if (selectedCategory) {
      const categoryImageIds = images
        .filter(image => image.imageCategory === selectedCategory)
        .map(image => image.id);

      const allCategoryRatings = [];
      for (const imageId of categoryImageIds) {
        const response = await handleGetImageRatings("admin@gmail.com", imageId);
        allCategoryRatings.push(...response.ratings);
      }
      setData(allCategoryRatings);
    } else {
      const response = await handleGetRatingsPaginated("admin@gmail.com", currentPage, itemsPerPage);
      setData(response.ratings);
      setTotalPages(Math.ceil(response.count / itemsPerPage));
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    fetchRatings();
  }, [selectedCategory, selectedImageId, currentPage]);

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

  const openModal = (img) => {
    handleFetchSingleImage(img.imageId, 'original')
      .then(data => {
        setSelectedImage(data.image.imageData);
        setShowModal(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <Header />
      <AdminNavBar />
      <div className="container mt-4">
        <h1 className="header">{t("adminRatingTitle")}</h1>
        <div className="mb-3 d-flex align-items-center">
          <select
            className="form-select me-2 small-select"
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedImageId(''); // Reset selected image when category changes
              setCurrentPage(1); // Reset to first page
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
            onChange={(e) => {
              setSelectedImageId(e.target.value);
              setCurrentPage(1); // Reset to first page
            }}
            disabled={!selectedCategory}
          >
            <option value="">{t("selectImageId")}</option>
            {filteredImages.map((item) => (
              <option key={item.id} value={item.id}>
                {item.imageName} - {item.imageCategory}
              </option>
            ))}
          </select>
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
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-secondary me-2"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            hidden={!showPagination()}
          >
            {"<<"}
          </button>
          <button
            className="btn btn-secondary me-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            hidden={!showPagination()}
          >
            {"◀"}
          </button>
          <div className="mt-2" hidden={!showPagination()}> {currentPage} {"/"} {totalPages}</div>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            hidden={!showPagination()}
          >
            {"▶"}
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
            hidden={!showPagination()}
          >
            {">>"}
          </button>
        </div>
      </div>
      <Modal show={showModal} onHide={closeModal} size="xl">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <div className="modal-card-div">
              <Card>
                <Card.Img variant="top" src={`data:image/jpeg;base64,${selectedImage}`} />
              </Card>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminRatingsPage;
