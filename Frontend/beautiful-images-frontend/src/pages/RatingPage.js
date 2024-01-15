import React, { useEffect, useState , useRef } from 'react';
import {Card, Row, Col} from 'react-bootstrap';
import Draggable from 'react-draggable';

const RatingPage = () => {
  const [images, setImages] = useState([]);
  const baskets = new Array(10).fill(0);
  const basketRefs = useRef([]);
  const NUM_BASKETS = 10;
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

  const removeImage = (image , basketIndex, imageIndex) => {
    const newBasketImages = [...basketImages];
    newBasketImages[basketIndex].splice(imageIndex, 1);
    setBasketImages(newBasketImages);
    const imageIndexInImages = images.findIndex(i => i.index === image.index);
    if (imageIndexInImages !== -1) {
      if (!images[image.index].visible && images[image.index].rated)
      {
        console.log("Herewego")
      }
      const newImages = [...images];
      //newImages[image.index].visible = true;
      //newImages[image.index].rated = false;
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
      if (!newBasketImages[droppedBasket].includes(image)) {
        newBasketImages[droppedBasket].push(image);
        setBasketImages(newBasketImages);
  
        const newImages = [...images];
        newImages[image.index].visible = false;
        newImages[image.index].rated = true;
        setImages(newImages);
      }
    }
    else{
      const newImages = [...images];
      newImages[image.index].visible = true;
      newImages[image.index].rated = false;
      setImages(newImages);
    }
  };

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
  <Draggable
    key={imageIndex}
    onStop={(e) => onDrop(e, image, index)}
  >
    <Card>
      <Card.Img 
        key={imageIndex} 
        onDragStart={(e) => e.preventDefault()}
        onClick={() => removeImage(image , index, imageIndex)}
        style={{width: "auto", height: "48px"}} 
        variant="top"
        src={`data:image/jpeg;base64,${image.data}`}/>
    </Card>
  </Draggable>
))} </div>
  ))}
      </Col>
      </Row>
    </div>
  );
};

export default RatingPage;