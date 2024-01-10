import React, { useEffect, useState } from 'react';
import {Card, Row, Col} from 'react-bootstrap';
import Draggable from 'react-draggable';

const RatingPage = () => {
  const [images, setImages] = useState([]);


  const fetchImages = () => {
    fetch('http://localhost:3001', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: 'Hello from client!' }),
    })
    .then(response => response.json())
    .then(data => { setImages(data)})
    .catch((error) => {
      console.error('Error:', error);
    });
  }

  useEffect(() => {
    fetchImages();
  }, []);

  return (
    <div className="App" style={{margin:"25px"}}>
      <h1>Beautiful Images</h1>
      <Row>
        {images.map((image, index) => (
          <Col xl={2} lg={3} md={3} sm={4} xs={6} 
               key={index} 
               style={{padding:"0px"}}>
            <Draggable>
            <Card style={{width: "auto"}}>
              <Card.Img 
                onDragStart={(e) => e.preventDefault()}
                style={{padding:"0px", margin:"0px", width:"auto" , border: "3px solid black"}} 
                variant="top"
                src={`data:image/jpeg;base64,${image.data}`} />
            </Card>
            </Draggable>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default RatingPage;