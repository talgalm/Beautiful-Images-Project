import React, { useEffect, useState , useRef } from 'react';
import {Card, Row, Col} from 'react-bootstrap';
import Draggable from 'react-draggable';

const RatingPage = () => {
  const [images, setImages] = useState([]);
  const baskets = new Array(10).fill(0);
  const basketRefs = useRef([]);
  const NUM_BASKETS = 10; // Define the number of baskets
  const initialBasketImages = Array(NUM_BASKETS).fill().map(() => []);
  const [basketImages, setBasketImages] = useState(initialBasketImages);


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

  const removeImage = (basketIndex, imageIndex) => {
    const newBasketImages = [...basketImages];
    const removedImage = newBasketImages[basketIndex][imageIndex];
    newBasketImages[basketIndex].splice(imageIndex, 1);
    setBasketImages(newBasketImages);
  
    // Find the removed image in the images array and set its visible attribute to true
    const imageIndexInImages = images.findIndex(image => `data:image/jpeg;base64,${image.data}` === removedImage);
    if (imageIndexInImages !== -1) {
      const newImages = [...images];
      newImages[imageIndexInImages].visible = true;
      setImages(newImages);
    }
  };

  const onDrop = (e, image, index) => {
    const basketElements = basketRefs.current.map(el => el.getBoundingClientRect());
    const droppedBasket = basketElements.findIndex(basket => 
      e.clientY >= basket.top && e.clientY <= basket.bottom && e.clientX >= basket.left && e.clientX <= basket.right
    );
    if (droppedBasket !== -1) {
      const newBasketImages = [...basketImages];
      if (!newBasketImages[droppedBasket].includes(`data:image/jpeg;base64,${image.data}`)) {
        newBasketImages[droppedBasket].push(`data:image/jpeg;base64,${image.data}`);
        setBasketImages(newBasketImages);
  
        const newImages = [...images];
        newImages[index].visible = false;
        setImages(newImages);
      }
    }
  }

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    basketRefs.current = basketRefs.current.slice(0, baskets.length);
  }, [baskets]);

  return (
    <div className="App" style={{margin:"25px"}}>
      <h1>Beautiful Images</h1>
      <Row>
      <Col xs={9}>
        <Row>
        {images.map((image, index) => (image.visible && (
          <Col xl={2} lg={3} md={3} sm={4} xs={6} 
               key={index} 
               style={{padding:"0px"}}>
            <Draggable
                 onStop={(e) => onDrop(e, image, index)}>
                  <Card style={{width: "auto" ,  border: "none"}}>
                    <Card.Img 
                      onDragStart={(e) => e.preventDefault()}
                      style={{padding:"0px", margin:"0px", width:"auto" , border: "3px solid black"}} 
                      variant="top"
                      src={`data:image/jpeg;base64,${image.data}`} />
                  </Card>
            </Draggable>
          </Col>
        )))}
        </Row>
      </Col>
      <Col xs={3}>
  {baskets.map((_, index) => (
    <div 
      key={index} 
      ref={el => basketRefs.current[index] = el}
      onDragOver={(e) => e.preventDefault()}
      style={{display: "flex", justifyContent: "flex-end", border: "1px solid black", borderLeft: "none", height: "48px", marginBottom: "10px"}}
    >
      
      {basketImages[index] && basketImages[index].map((image, imageIndex) => (
  <img 
    src={image} 
    style={{width: "auto", height: "48px"}} 
    alt={`Basket ${index + 1} content ${imageIndex + 1}`} 
    key={imageIndex} 
    onClick={() => removeImage(index, imageIndex)} // Add this line
  />
))} </div>
  ))}
      </Col>
      </Row>
    </div>
  );
};

export default RatingPage;