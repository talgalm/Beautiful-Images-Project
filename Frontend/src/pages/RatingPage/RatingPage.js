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
  const [count , setCount] = useState(0);
  const [percent , setPercent] = useState('0%');
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
      setImages(data.images); 
      setCount(data.images.filter(item => !item.visible).length);
      const newPercent =  (1 / 70) * 100 * data.images.filter(item => !item.visible).length;
      const finalPercent = Math.min(newPercent, 100);
      setPercent( `${finalPercent.toFixed(2)}%`);
      setInitialNumberOfImages(images.filter(image => image.rating !== 0).length);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!loading && images.length === 0) {
      fetchData()
    }
  }, [loading, images]);


  useEffect(() => {

  }, [percent]);
  

  

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
    if (droppedItemData.from != 0) {
      setCount(count-1)

      //calc percents
      const numericPercent = parseFloat(percent);
      const newPercent = numericPercent - (1 / 70) * 100;
      const finalPercent = Math.min(newPercent, 100);
      setPercent( `${finalPercent.toFixed(2)}%`);

      droppedItemData.data.rating = 0;
      droppedItemData.data.visible = true;
      setImages((prevState) => [...prevState, droppedItemData.data]);
      handleRateImage(droppedItemData.data.imageId, droppedItemData.from, 0);
    }
  }

  function handleOnDragOver(event) {
    event.preventDefault();
  }

  function onDropImage(dataImg) {
    setCount(count+1)

     //calc percents
    const numericPercent = parseFloat(percent);
    const newPercent = numericPercent + (1 / 70) * 100;
    const finalPercent = Math.min(newPercent, 100);
    setPercent( `${finalPercent.toFixed(2)}%`);

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

    if (!next){
      if (imgIndx===images.length-1){
        setImgIndex(0)
        handleFetchSingleImage(images[0].imageId, "original")
        .then((data) => {
          setSelectedImage(data.image.imageData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
      else{
        setImgIndex(imgIndx+1)
        setSelectedImage(images[imgIndx+1].imageData)
        handleFetchSingleImage(images[imgIndx+1].imageId, "original")
        .then((data) => {
          setSelectedImage(data.image.imageData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
    }
    else{
      if (imgIndx===0){
        setImgIndex(images.length-1)
        handleFetchSingleImage(images[images.length-1].imageId, "original")
        .then((data) => {
          setSelectedImage(data.image.imageData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
      else{
        setImgIndex(imgIndx-1)
        handleFetchSingleImage(images[imgIndx-1].imageId, "original")
        .then((data) => {
          setSelectedImage(data.image.imageData);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
      }
    }
    
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
                img.visible && <div
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
                          draggable={false}
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
          <div className="w">
          <div class="progress">
        <div class="bar" style={{width:percent}}>
          <p class="percent">{percent}</p>
        </div>
      </div>
          </div>
          <div className="w2"> <button className="button-53" onClick={openFinishModal}>
            {t("doneEvaluate")}
          </button></div>
          
        {/* <button className="button-53" onClick={openFinishModal}>
            {t("doneEvaluate")}
          </button>
          <div class="progress">
        <div class="bar" style={{width:'0%'}}>
          <p class="percent">35%</p>
        </div>
      </div> */}
        </div> 
      </div>
      <Modal show={showFinishModal} onHide={closeFinishModal} size="l">
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div>
          <div
            className="modal-div"
            dir={isRtl ? "rtl" : "ltr"}
            dangerouslySetInnerHTML={{
              __html: t(
                count > 69
                  ? "FinishEvaluateAllImages"
                  : "FinishEvaluateSomeImages",
                { imagesNumber: count}
              ),
            }}
          />
          <div className="buttons-in-modal">
            { (
              <button className="button-53" onClick={count > 69 ? handleDisplayMoreImages : closeFinishModal}>
                {count > 69 ? t("displayMoreImages") :t("continueEvaluations")}
              </button>
            )}
            <button className="button-53" onClick={handleFinish}>
              {t("Finish")}
            </button>
          </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default RatingPage;
