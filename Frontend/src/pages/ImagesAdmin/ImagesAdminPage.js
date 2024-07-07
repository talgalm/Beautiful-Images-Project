import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  handleCreateImage,
  handleDeleteImage,
  handleGetAllImagesPaginated,
  handleUpdateImage,
} from "../../services/adminService";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ImagesAdminPage.css";
import { Card } from "react-bootstrap";
import Header from "../../components/Header/Header";
import { Modal } from "react-bootstrap";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as mobilenet from "@tensorflow-models/mobilenet";
import deleteIcon from "../../../src/icons/minus-image-photo-icon.svg";
import { handleFetchSingleImage } from "../../services/userService";
import AdminNavBar from "../../components/AdminNavBar/adminNavBar";

const ImagesAdminPage = () => {
  const { t } = useTranslation();
  const [images, setImages] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewImageModal, setShowViewImageModal] = useState(false);
  const [imageFile, setImageFile] = useState();
  const [loading, setLoading] = useState(true);
  const [tags, setTags] = useState(true);
  const [gen, setGen] = useState(false);
  const [input, setInput] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageName, setImageName] = useState("");
  const [imageData, setImageData] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(20);

  const [imageToDelete, setImageToDelete] = useState({});
  const [imageDataToDelete, setImageDataToDelete] = useState("");

  const handleSelectChange = (event) => {
    setSelectedCategory(event.target.value);
  };
  const setSelectedValueText = (event) => {
    setSelectedCategory(event.target.value);
  };

  const openViewImageModal = (img) => {
    handleFetchSingleImage(img.id, "original")
      .then((data) => {
        setSelectedImage(data.image.imageData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setShowViewImageModal(true);
  };

  const closeViewImageModal = () => {
    setShowViewImageModal(false);
  };

  const fetchImages = async () => {
    handleGetAllImagesPaginated(
      "admin@gmail.com",
      currentPage,
      itemsPerPage
    ).then((response) => {
      setImages(response.images);
      setTotalPages(Math.ceil(response.count / itemsPerPage));
    });
  };

  useEffect(() => {
    fetchImages();
  }, [currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const closeAddModal = () => {
    setTags([]);
    setImageFile();
    setShowAddModal(false);
  };
  const openModal = () => {
    setImageFile();
    setShowAddModal(true);
  };

  const openDeleteModal = (item) => {
    setImageToDelete(item);
    handleFetchSingleImage(item.id, "original").then((data) => {
      setImageDataToDelete(data.image.imageData);
    });
    setShowDeleteModal(true);
  };

  const [isEdit, setIsEdit] = useState(false);
  const [editedCategory, setEditedCategory] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);

  const editCategory = (item, index) => {
    setEditedCategory(item.imageCategory);
    setIsEdit(true);
    setEditIndex(index);
  };

  const editCategoryDB = (item) => {
    handleUpdateImage(
      "admin@gmail.com",
      item.id,
      item.imageName,
      editedCategory,
      item.imageData
    ).then((response) => {
      setIsEdit(false);
      setEditIndex(-1);
      setTimeout(() => {
        fetchImages();
      }, 500);
      if (response.message) {
        alert(response.message);
      }
    });
  };
  const changeEdit = (event) => {
    setEditedCategory(event.target.value);
  };

  const classifyImage = async (image) => {
    // Load MobileNet model
    const model = await mobilenet.load();

    // Classify the image
    const predictions = await model.classify(image);

    // Extract top tags
    const topTags = predictions.map((prediction) => prediction.className);
    setSelectedCategory(
      topTags.flatMap((str) => str.split(",").map((item) => item.trim()))[0]
    );
    setTags(
      topTags.flatMap((str) => str.split(",").map((item) => item.trim()))
    );
    setLoading(false);
    console.log(
      topTags.flatMap((str) => str.split(",").map((item) => item.trim()))
    );
  };

  function handleNewImageFileChanged(e) {
    const file = e.target.files[0];
    setImageFile(URL.createObjectURL(e.target.files[0]));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const image = new Image();
        image.src = reader.result;
        image.onload = () => {
          classifyImage(image);
          setImageData(reader.result.split(",")[1]);
        };
        setImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  }

  const generateCategory = async () => {
    setGen(true);
  };
  const enterCategory = async () => {
    setInput(true);
  };
  const createImage = async () => {
    await handleCreateImage(
      "admin@gmail.com",
      imageName,
      selectedCategory,
      imageData
    ).then((response) => {
      setShowAddModal(false);
      setTimeout(() => {
        fetchImages();
      }, 500);
      if (response.message) {
        alert(response.message);
      }
    });
  };

  const deleteImage = async () => {
    await handleDeleteImage("admin@gmail.com", imageToDelete.id).then(
      (response) => {
        if (images.length === 1 && currentPage === totalPages) {
          setTotalPages(totalPages - 1);
          setCurrentPage(currentPage - 1);
        } else {
          fetchImages();
        }
        setShowDeleteModal(false);
        if (response.message) {
          alert(response.message);
        }
      }
    );
  };

  return (
    <div>
      <Header />
      <AdminNavBar />
      <div className="container mt-4">
        <h1 className="header">{t("imageManage")}</h1>
        <div className="mb-3 d-flex justify-content-center">
          <button className="btn btn-primary m-1" onClick={openModal}>
            {t("addImage")}
          </button>
        </div>
        <div className="table-responsive table-wrapper">
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>{t("imageIdColumn")}</th>
                <th>{t("imageIconColumn")}</th>
                <th>{t("imageNameColumn")}</th>
                <th>{t("imageCategoryColumn")}</th>
                <th>{t("totalRatingsColumn")}</th>
                <th>{t("avarageRatingColumn")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="thead-dark-body">
              {images.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>
                    <Card.Img
                      className="imageCard"
                      src={`data:image/jpeg;base64,${item.imageData}`}
                      style={{ maxWidth: "60px", maxHeight: "60px" }}
                      onClick={() => openViewImageModal(item)}
                    />
                  </td>
                  <td>{item.imageName}</td>
                  <td>
                    {!isEdit || index !== editIndex ? (
                      <div onClick={() => editCategory(item, index)}>
                        {item.imageCategory}
                      </div>
                    ) : (
                      <div className="editDiv">
                        <button
                          className="btn btn-primary2"
                          onClick={() => {
                            setEditIndex(-1);
                          }}
                        >
                          cancel
                        </button>
                        <button
                          className="btn btn-primary3"
                          onClick={() => editCategoryDB(item)}
                        >
                          save
                        </button>
                        <input value={editedCategory} onChange={changeEdit} />
                      </div>
                    )}
                  </td>
                  <td>{item.totalRatings}</td>
                  <td>{item.averageRating.toFixed(2)}</td>
                  <td onClick={() => openDeleteModal(item)}>
                    <img src={deleteIcon} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <button
            className="btn btn-secondary me-2"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            {"<<"}
          </button>
          <button
            className="btn btn-secondary me-2"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            {"◀"}
          </button>
          <div className="mt-2">
            {" "}
            {currentPage} {"/"} {totalPages}
          </div>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            {"▶"}
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            {">>"}
          </button>
        </div>
      </div>
      <Modal show={showAddModal} onHide={closeAddModal} size="xl">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div>
            <input type="file" onChange={handleNewImageFileChanged} />
            {imageFile && <img src={imageFile} />}
            <div className="buttons">
              <button
                className="btn btn-primary"
                disabled={!imageFile}
                onClick={generateCategory}
              >
                {t("generateCategory")}
              </button>
              <button
                className="btn btn-primary"
                disabled={!imageFile}
                onClick={enterCategory}
              >
                {t("enterMan")}
              </button>
            </div>
            {!loading ? (
              <div className="tagsDiv">
                {gen && (
                  <select
                    onChange={handleSelectChange}
                    value={selectedCategory}
                  >
                    {tags.map((tag, index) => (
                      <option key={index} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ) : (
              gen && (
                <div className="loader-div">
                  <span className="loader"></span>
                </div>
              )
            )}
            {input !== false && (
              <div className="sendDiv">
                <input
                  placeholder={t("enterMan")}
                  value={selectedCategory}
                  onChange={setSelectedValueText}
                />
                <input
                  placeholder={t("enterName")}
                  value={imageName}
                  onChange={(e) => setImageName(e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  style={{ backgroundColor: "red !important" }}
                  onClick={createImage}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        size="m"
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="deleteContainer">
            Are you sure you want to delete ?
          </div>
          <div className="imgDiv">
            <Card.Img
              className="imageCard"
              src={`data:image/jpeg;base64,${imageDataToDelete}`}
              style={{ maxWidth: "500px", maxHeight: "500px" }}
            />
            <div className="buttonsDiv">
              <button className="btn btn-primary" onClick={deleteImage}>
                Delete Image
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={showViewImageModal} onHide={closeViewImageModal} size="xl">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <div className="modal-card-div">
              <Card>
                <Card.Img
                  variant="top"
                  src={`data:image/jpeg;base64,${selectedImage}`}
                />
              </Card>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ImagesAdminPage;
