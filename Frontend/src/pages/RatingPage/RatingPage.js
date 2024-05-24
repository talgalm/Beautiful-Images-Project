import React, { useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import "./ratingPage.css";
import Basket from "../Baskets/Basket";
import {
  handleFetchImages,
  handleFetchSingleImage,
} from "../../services/userService";
import {
  handleRateImage,
  handleSaveRating,
} from "../../services/ratingService";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import arrowLeft from "../../../src/icons/arrow-circle-left.svg"
import arrowLeftWhite from "../../../src/icons/arrow-circle-left-w.svg"
import arrowRight from "../../../src/icons/arrow-circle-right.svg"
import arrowRightWhite from "../../../src/icons/arrow-circle-right-w.svg"

const RatingPage = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const isRtl = ["he"].includes(i18n.language);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imgIndx, setImgIndex] = useState(-1);
  const [initialNumberOfImages, setInitialNumberOfImages] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (!token || !email) {
      navigate("/home");
    } else {
      fetchData();
    }
  }, []);

  const fetchData = async () => {
    try {
      const data = await handleFetchImages();
      setImages(data.images); // Filter here
      setInitialNumberOfImages(data.images.length);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && images.length === 0) {
      fetchData();  
    }
  }, [loading, images]);

  function handleOnDrag(event, dataImg) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "application/json",
      JSON.stringify({ from: 0, data: dataImg })
    );
  }

  function handleOnDrop(event) {
    const droppedItemData = JSON.parse(
      event.dataTransfer.getData("application/json")
    );
    if (!images.find((item) => item.imageId === droppedItemData.data.imageId)) {
      droppedItemData.data.rating = 0;
      setImages((prevState) => [...prevState, droppedItemData.data]);
      handleRateImage(droppedItemData.data.imageId, droppedItemData.from, 0);
    }
  }

  function handleOnDragOver(event) {
    event.preventDefault();
  }

  function onDropImage(dataImg) {
    const updatedImages = images.filter(
      (img) => img.imageId !== dataImg.data.imageId
    );
    setImages(updatedImages);
  }

  function openModal(image , index) {
    handleFetchSingleImage(image.imageId, "original")
      .then((data) => {
        setSelectedImage(data.image.imageData);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    setImgIndex(index);
    setShowModal(true);
  }

  function handleFinish() {
    const email = localStorage.getItem("email");
    if (email) {
      handleSaveRating(email)
        .then((data) => {
          if (data.flag === true) {
            closeFinishModal();
            navigate("/finish");
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  function handleDisplayMoreImages() {
    const email = localStorage.getItem("email");
    if (email) {
      handleSaveRating(email)
        .then((data) => {
          if (data.flag === true) {
            closeFinishModal();
            setLoading(true);
            fetchData();
          } else {
            alert("Error: " + data.message);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  const handleArrow = (next , img) => {
    if (next){
      if (imgIndx === images.length - 1)
        setImgIndex(-1)
      setImgIndex(imgIndx+1)
    }
    else{
      if (imgIndx === 0)
        setImgIndex(images.length)
      setImgIndex(imgIndx-1)
    }
    setSelectedImage(images[imgIndx].imageData)
  }


  function openFinishModal(image) {
    setShowFinishModal(true);
  }

  const closeFinishModal = () => {
    setShowFinishModal(false);
  };

  if (loading) {
    return (
      <div className="loader-div">
        <span className="loader"></span>
      </div>
    );
  }
  return (
    <div>
      <Header />
      <div className="rating-container-page">
        <div className="rating-container">
          <div className="image-display-div">
            <div
              className="images-dashboard"
              onDrop={(e) => handleOnDrop(e)}
              onDragOver={(e) => handleOnDragOver(e)}
            >
              {images.map((img , index) => (
                <div
                  key={img.imageId}
                  className="draggable"
                  onDragStart={(e) => handleOnDrag(e, img)}
                  onClick={() => openModal(img , index)}
                >
                  <Card className="cardContainer">
                    <Card.Img
                      className="imageCard"
                      src={`data:image/jpeg;base64,${img.imageData}`}
                    />
                  </Card>
                </div>
              ))}

              <Modal show={showModal} onHide={closeModal} size="xl">
                <Modal.Header closeButton></Modal.Header>
                <Modal.Body>
                  {selectedImage && (
                    <div className="modal-card-div">
                      <div className="next-card">
                        <img src={arrowLeft}/>
                      </div>
                      <div className="next-card-w"  onClick={() => handleArrow(true , selectedImage)}>
                        <img src={arrowLeftWhite}/>
                      </div>
                      <Card>
                        <Card.Img
                          variant="top"
                          src={`data:image/jpeg;base64,${selectedImage}`}
                        />
                      </Card>
                      <div className="prev-card">
                        <img src={arrowRight}/>
                      </div>
                      <div className="prev-card-w" onClick={() => handleArrow(false , selectedImage)}>
                        <img src={arrowRightWhite}/>
                      </div>
                    </div>
                  )}
                </Modal.Body>
              </Modal>
            </div>
          </div>

          <div className="baskets-div">
            {[...Array(10)].reverse().map((_, index) => (
              <div key={`basket-wrapper-${10 - index}`}>
                <Basket
                  index={10 - index}
                  onDropImage={onDropImage}
                  sessionImages={images.filter(
                    (item) => item.rating === 10 - index
                  )}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="button-container">
          <button className="button-53" onClick={openFinishModal}>
            {t("doneEvaluate")}
          </button>
        </div>
      </div>
      <Modal show={showFinishModal} onHide={closeFinishModal} size="l">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div
            className="modal-div"
            dir={isRtl ? "rtl" : "ltr"}
            dangerouslySetInnerHTML={{
              __html: t(
                initialNumberOfImages === initialNumberOfImages - images.length
                  ? "FinishEvaluateAllImages"
                  : "FinishEvaluateSomeImages",
                { imagesNumber: initialNumberOfImages - images.length }
              ),
            }}
          />
          <div className="buttons-in-modal">
            {initialNumberOfImages ===
              initialNumberOfImages - images.length && (
              <button className="button-53" onClick={handleDisplayMoreImages}>
                {t("displayMoreImages")}
              </button>
            )}
            <button className="button-53" onClick={handleFinish}>
              {t("Finish")}
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RatingPage;
