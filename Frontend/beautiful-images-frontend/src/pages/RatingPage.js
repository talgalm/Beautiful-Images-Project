import React, { useEffect, useState } from 'react';
import {Card, Modal} from 'react-bootstrap';
import './ImagesPage.css';
import { useTranslation } from 'react-i18next';
import './ratingPage.css'
import Basket from './Baskets/Basket';
import { handleFetchImages, handleFetchSingleImage } from '../services/userService';
import { handleRateImage } from '../services/ratingService';


const RatingPage = () => {
  const { t } = useTranslation();

  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchImages = () => {
    handleFetchImages()
    .then(data => { setImages(data)})
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  useEffect(()=>{
    fetchImages();
  },[])

  function handleOnDrag(event , dataImg)
  {
    event.dataTransfer.setData("application/json", JSON.stringify({from:0,data:dataImg}));

  }

  function handleOnDrop(event) {
    const droppedItemData = JSON.parse(event.dataTransfer.getData("application/json"));
    console.log(images)
    console.log(droppedItemData.data)
    if (!images.find(item => item.file === droppedItemData.data.file)){
      setImages(prevState => [...prevState, droppedItemData.data]);
      handleRateImage("user",droppedItemData.from , droppedItemData.data.file , 0)
    }


  }

  function handleOnDragOver(event) {
      event.preventDefault();
  }


  function onDropImage(dataImg){
    const updatedImages = images.filter(img => img.file !== dataImg.data.file);
    setImages(updatedImages);
  }

  function openModal(image){
    handleFetchSingleImage("" , image.file , 'original')
    .then(data => { setSelectedImage(data)})
    .catch((error) => {
      console.error('Error:', error);
    });

    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  } 

  return (
    <div className="rating-page-div">
      <div className='image-display-div'>
        <div className='images-dashboard' onDrop={(e)=>handleOnDrop(e)} onDragOver={(e)=>handleOnDragOver(e)}>
            {images.map((img, index)=> (
            <div onDragStart={(e) => handleOnDrag(e, img)} onClick={(e) => openModal(img)} >
              {/* <Image key={index} img={img.data}/> */}
              <Card className='cardContainer'>
              <Card.Img 
                className='imageCard'
                src={`data:image/jpeg;base64,${img.data}`} />
            </Card>
            </div>
            ))}

      <Modal show={showModal} onHide={closeModal} size="xl" >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && 
          <Card>
              <Card.Img variant="top" src={`data:image/jpeg;base64,${selectedImage.data}`} />
            </Card>
          }
        </Modal.Body>
      </Modal>
        </div>
      </div>

      <div className='baskets-div'>
        {[...Array(10)].map((_, index) => (
          <div>
            <Basket key={index} index={index + 1} onDropImage={onDropImage} />
          </div>
        ))}
      </div>

    </div>
  );
};


export default RatingPage;
