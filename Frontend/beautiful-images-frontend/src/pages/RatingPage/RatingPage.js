import React, { useEffect, useState } from 'react';
import {Card, Modal} from 'react-bootstrap';
import '../ImagesPage/ImagesPage';
import { useTranslation } from 'react-i18next';
import './ratingPage.css'
import Basket from '../Baskets/Basket';
import { handleFetchImages, handleFetchSingleImage } from '../../services/userService';
import { handleRateImage } from '../../services/ratingService';
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';


const RatingPage = () => {
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const isRtl = ['he'].includes(i18n.language);
  const [curHeight , setCurHeight] = useState('650px')

  const [images, setImages] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [initialNumberOfImages, setInitialNumberOfImages] = useState(null);
  const navigate = useNavigate();

  const fetchImages = () => {
    handleFetchImages("gil@gmail.com")
    .then(data => { 
      setImages(data.images)
      setInitialNumberOfImages(data.images.length)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  useEffect(()=>{
    fetchImages();
  },[])

  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!token || !email) {
        navigate("/home"); 
    }
}, []); 


  function handleOnDrag(event , dataImg)
  {
    event.dataTransfer.setData("application/json", JSON.stringify({from:0,data:dataImg}));

  }

  function handleOnDrop(event) {
    const droppedItemData = JSON.parse(event.dataTransfer.getData("application/json"));
    if (!images.find(item => item.imageId === droppedItemData.data.imageId)){
      setImages(prevState => [...prevState, droppedItemData.data]);
      handleRateImage(droppedItemData.from , droppedItemData.data.file , 0)
    }


  }

  function handleOnDragOver(event) {
      event.preventDefault();
  }


  function onDropImage(dataImg){
    const updatedImages = images.filter(img => img.imageId !== dataImg.data.imageId);
    setImages(updatedImages);
  }

  function openModal(image){
    handleFetchSingleImage(image.imageId , 'original')
    .then(data => { 
      setSelectedImage(data.image.imageData)})
    .catch((error) => {
      console.error('Error:', error);
    });

    setShowModal(true);
  }

  function handleFinish(){
    navigate("/finish")
  }

  const closeModal = () => {
    setShowModal(false);
  } 

  function openFinishModal(image){

    setShowFinishModal(true);
  }

  const closeFinishModal = () => {
    setShowFinishModal(false);
  } 

  function calcHeight(){
    if(images.length % 10 === 0){
      setCurHeight((images.length*10-50).toString()+'px');
    }
  }
  useEffect(()=>{
    calcHeight()
  },[images])
  

  return (
    <div className='all-rating-page-div'>
      <Header/>
    <div className="rating-page-div">
      <div className='image-display-div'>
        <div className='images-dashboard' style={{height:curHeight}} onDrop={(e)=>handleOnDrop(e)} onDragOver={(e)=>handleOnDragOver(e)}>
            {images.map((img, index)=> (
            <div onDragStart={(e) => handleOnDrag(e, img)} onClick={(e) => openModal(img)} >
              <Card className='cardContainer'>
              <Card.Img 
                className='imageCard'
                src={`data:image/jpeg;base64,${img.imageData}`} />
            </Card>
            </div>
            ))}

      <Modal show={showModal} onHide={closeModal} size="xl" >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && 
          <Card>
              <Card.Img variant="top" src={`data:image/jpeg;base64,${selectedImage}`} />
            </Card>
          }
        </Modal.Body>
      </Modal>
        </div>
      </div>

      <div className='baskets-div'>
        {[...Array(10)].reverse().map((_, index) => (
          <div>
            <Basket key={index} index={10 - index} onDropImage={onDropImage} />
          </div>
        ))}
      </div>

    </div>
    <button className='button-53' onClick={openFinishModal}>{t('doneEvaluate')}</button>
    <Modal show={showFinishModal} onHide={closeFinishModal} size="l" >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
        <div dir={isRtl ? 'rtl' : 'ltr'} dangerouslySetInnerHTML={{ __html: t(initialNumberOfImages === initialNumberOfImages - images.length ? 'FinishEvaluateAllImages' : 'FinishEvaluateSomeImages', { imagesNumber: initialNumberOfImages - images.length }) }} />
        <div className='buttons-in-modal'>
          {initialNumberOfImages === initialNumberOfImages - images.length && <button className='button-53'>{t('displayMoreImages')}</button>}
          <button className='button-53' onClick={handleFinish}>{t('Finish')}</button>
        </div>
      </Modal.Body>
      </Modal>
    </div>
  );
};


export default RatingPage;
