import React from 'react';
import { Card } from 'react-bootstrap';

export const ImageStyle = ({src}) => (
  <Card.Img 
    onDragStart={(e) => e.preventDefault()}
    style={{padding:"0px", margin:"0px", width:"auto" , border: "3px solid black"}} 
    variant="top"
    src={src} 
  />
);