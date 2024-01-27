import React, { useEffect, useState , useRef } from 'react';
import {Card, Row, Col} from 'react-bootstrap';
import Draggable from 'react-draggable';
import { ImageStyle } from '../Image/Image';

const RatingPage = () => {
  const [images, setImages] = useState([]);
  const baskets = new Array(10).fill(0);
  const basketRefs = useRef([]);
  const [basketImages, setBasketImages] = useState(Array.from({length: 10}, () => []));


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

  useEffect(() => {
  }, [images]);

  useEffect(() => {
  }, [basketImages]);

  useEffect(() => {
    basketRefs.current = basketRefs.current.slice(0, baskets.length);
  }, [baskets]);

  
const handleStop = (e, data , dragFrom) => {
  const basketElements = basketRefs.current.map(el => el.getBoundingClientRect());
  const droppedBasket = basketElements.findIndex(basket => 
    e.clientY >= basket.top && e.clientY <= basket.bottom && e.clientX >= basket.left && e.clientX <= basket.right
  );
  if (droppedBasket === -1 && images[data.index].rating !== undefined){
    setBasketImages(prevBasketImages => {
      const newBasketImages = [...prevBasketImages];
      newBasketImages[images[data.index].rating] = newBasketImages[images[data.index].rating].filter(item => item !== data);
      images[data.index].rating = undefined;
      images[data.index].visible = true;
      return newBasketImages;
    });
  }

  if (droppedBasket !== -1) {
    setBasketImages(prevBasketImages => {
      const newBasketImages = [...prevBasketImages];
      images[data.index].visible = false;

      // If the image already has a rating, remove it from its current basket
      if (images[data.index].rating !== undefined) {
        newBasketImages[images[data.index].rating] = newBasketImages[images[data.index].rating].filter(item => item !== data);
        images[data.index].rating = undefined;

      }

      // If the image is not already in the dropped basket, add it to the dropped basket
      if (!newBasketImages[droppedBasket].includes(data)) {
        images[data.index].rating = droppedBasket;
        newBasketImages[droppedBasket].push(data);
      }
      return newBasketImages;
    });
  }
};

  
  return (
    <div className="App" style={{margin:"25px"}}>
      <h1>Beautiful Images</h1>
      <Row style={{ display: 'flex', flexDirection: 'row', position: 'absolute', top: 100, bottom: 0, left: 0, right: 0 }}> 
        <Col xs={9}  style={{ display: 'flex', flexDirection: 'column' }}>
          <Row>{images.map((image, index) => (image.visible &&
            <Col xl={1} lg={2} md={3} sm={4} xs={6} 
              key={index} 
              style={{padding:"0px"}}>
            <Draggable onStop={(e) => handleStop(e, image , 'main')}>
            <Card style={{width: "auto"}}>
              <ImageStyle src={`data:image/jpeg;base64,${image.data}`} />
            </Card>
          </Draggable>
        </Col>
        ))}
      </Row>
    </Col>
  <Col xs={3} style={{ display: 'flex', flexDirection: 'column'}}>
  {baskets.map((_, index) => (
    <div 
  key={index} 
  ref={el => basketRefs.current[index] = el}
  style={{border: "3px solid black", borderLeft: "none", flex: 1, marginBottom: "10px", display: 'flex', flexDirection: 'row', flexWrap: 'wrap'}}>
  {basketImages[index] && basketImages[index].map((image, imgIndex) => (
    <Draggable  onStop={(e) => handleStop(e, image , 'basket')}>
      <Card.Img
      onDragStart={(e) => e.preventDefault()}
      key={imgIndex} 
      src={`data:image/jpeg;base64,${image.data}`} 
      alt={`Image ${imgIndex}`} 
      style={{width: '20%', height: 'auto'}}
      /></Draggable>
  ))}
</div> 
  ))}
</Col>
</Row>
    </div>
  );
};

export default RatingPage;