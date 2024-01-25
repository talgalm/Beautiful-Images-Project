import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>APP</h1>
      <nav>
        <Button variant="primary"><Link to="/home" className="text-light">Home</Link></Button>{' '}
        <Button variant="primary"><Link to="/login" className="text-light">Login</Link></Button>{' '}
        <Button variant="primary"><Link to="/images" className="text-light">Images Page</Link></Button>{' '}
        <Button variant="primary"><Link to="/rating" className="text-light">Rating</Link></Button>{' '}
        <Button variant="primary"><Link to="/admin" className="text-light">Admin</Link></Button>{' '}
      </nav>
    </div>
  );
}

export default App;