import React, { useState } from 'react';
import {Button, Card, Row, Col, Modal} from 'react-bootstrap';
import './ImagesPage.css';
import { useTranslation } from 'react-i18next';

const ImagesPage = () => {
  const { t } = useTranslation();

  const [images, setImages] = useState([]);
  const [displayedImages, setdIsplayedImages] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);


  const fetchImages = () => {
    fetch('http://localhost:3001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Hello from client!' }),
    })
    .then(response => response.json())
    .then(data => {setdIsplayedImages(true) ; setImages(data)})
    .catch((error) => {
      console.error('Error:', error);
    });
  }


  const openModal = (image) => {
    setSelectedImage(image);
    setShowModal(true);
  }

  const closeModal = () => {
    setShowModal(false);
  }

  return (
    <div className="App" style={{margin:"25px"}}>
      <h1>Beautiful Images</h1>
      <Button variant="primary" onClick={fetchImages}>{t('choose-photos')}</Button>
      {displayedImages && <Row>
        {images.map((image, index) => (
          <Col xl={2} lg={3} md={3} sm={4} xs={6} 
               key={index} 
               onClick={() => openModal(image)} 
               style={{padding:"4px"}}>
            <Card className='cardContainer'>
              <Card.Img 
                className='imageCard'
                src={`data:image/jpeg;base64,${image.data}`} />
            </Card>
          </Col>
        ))}
      </Row>}

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
  );
};

export default ImagesPage;