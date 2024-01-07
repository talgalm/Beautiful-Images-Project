import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [displayedImages, setdIsplayedImages] = useState(false);


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


  return (
    <div className="App">
      <h1>Beautiful Images</h1>
      <Button variant="primary" onClick={fetchImages}>Refresh Images</Button>
      {displayedImages && <Row>
        {images.map((image, index) => (
          <Col sm={2} key={index}>
            <Card>
              <Card.Img variant="top" src={`data:image/jpeg;base64,${image.data}`} />
            </Card>
          </Col>
        ))}
      </Row>}
    </div>
  );
}

export default App;