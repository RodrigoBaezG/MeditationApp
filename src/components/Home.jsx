import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Mantenemos la importación

const Home = () => {
  return (
    // Aplicamos la clase semántica 'home-container'
    <div className="home-container"> 
      
      {/* Aplicamos la clase semántica 'hero-section' */}
      <div className="hero-section">
        <h1 className="main-title">Letting be Meditation</h1>
        <p className="tagline">Find peace within you.</p>  
      </div>
      {/* Aplicamos la clase semántica 'info-section' */}
      <div className="info-section">
        <h3>Why do we meditate?</h3>
        <h3>What is meditation for?</h3>
      </div>
    </div>
  );
};

export default Home;