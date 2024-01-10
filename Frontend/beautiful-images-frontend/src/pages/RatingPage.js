import React, { useEffect, useState , useRef } from 'react';
import {Card, Row, Col} from 'react-bootstrap';
import Draggable from 'react-draggable';

const RatingPage = () => {
  const [images, setImages] = useState([]);

  const baskets = new Array(10).fill(0);
  const basketRefs = useRef([]);

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
    basketRefs.current = basketRefs.current.slice(0, baskets.length);
  }, [baskets]);

  return (
    <div className="App" style={{margin:"25px"}}>
      <h1>Beautiful Images</h1>
      <Row>
      <Col xs={9}>
        <Row>
        {images.map((image, index) => (
          <Col xl={2} lg={3} md={3} sm={4} xs={6} 
               key={index} 
               style={{padding:"0px"}}>
            <Draggable
                  onStop={(e) => {
                    const basketElements = basketRefs.current.map(el => el.getBoundingClientRect());
                    const droppedBasket = basketElements.findIndex(basket => 
                      e.clientY >= basket.top && e.clientY <= basket.bottom && e.clientX >= basket.left && e.clientX <= basket.right
                    );
                    if (droppedBasket !== -1) {
                      console.log(`Dropped on basket ${droppedBasket + 1}`);
                    }
                  }}
                  >
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
      </Col>
      <Col xs={3}>
          {baskets.map((_, index) => (
              <div 
                key={index} 
                ref={el => basketRefs.current[index] = el}
                onDragOver={(e) => e.preventDefault()}
                style={{border: "1px solid black", borderLeft: "none", height: "48px", marginBottom: "10px"}}
              ></div> 
          ))}
      </Col>
      </Row>
    </div>
  );
};

export default RatingPage;