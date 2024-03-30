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
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [initialNumberOfImages, setInitialNumberOfImages] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await handleFetchImages();
            setImages(data.images);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    fetchData();
    fetchData();

}, []);



  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    
    if (!token || !email) {
      navigate("/home"); 
  }

}, []); 



  function handleOnDrag(event , dataImg)
  {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData("application/json", JSON.stringify({from:0,data:dataImg}));

  }

  function handleOnDrop(event) {
    const droppedItemData = JSON.parse(event.dataTransfer.getData("application/json"));
    if (!images.find(item => item.imageId === droppedItemData.data.imageId)){
      setImages(prevState => [...prevState, droppedItemData.data]);
      handleRateImage(droppedItemData.data.imageId, droppedItemData.from ,  0)
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
  
  if (loading) {
    return <div className='loader-div'><span class="loader"></span></div>;
}
  

  return (
    <div className='all-rating-page-div'>
      <Header/>
    <div className="rating-page-div">
      <div className='image-display-div'>
        {<div className='images-dashboard' style={{height:curHeight}} onDrop={(e)=>handleOnDrop(e)} onDragOver={(e)=>handleOnDragOver(e)}>
                {images.filter(item => item.rating === 0).map((img, index)=> (
            <div key={img.imageId} onDragStart={(e) => handleOnDrag(e, img)} onClick={(e) => openModal(img)}>
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
        </div>}
      </div>

      <div className='baskets-div'>
    {[...Array(10)].reverse().map((_, index) => (
        <div key={`basket-wrapper-${10 - index}`}>
            <Basket index={10 - index} onDropImage={onDropImage} sessionImages={images.filter(item => item.rating === 10 - index)} />
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
