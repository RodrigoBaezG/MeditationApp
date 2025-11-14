import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Mantenemos la importación

const Home = () => {
  return (
    // Aplicamos la clase semántica 'home-container'
    <div className="home-container"> 
      
      {/* Aplicamos la clase semántica 'hero-section' */}
      <div className="hero-section">
        <h1 className="main-title">Encuentra tu Serenidad Diaria</h1>
        <p className="tagline">Tu espacio personal para la práctica y el crecimiento interior.</p>
        
        <div className="image-placeholder">
          <img 
            src="https://placehold.co/600x350/a9d18e/000000?text=Momento+de+Calma" 
            alt="Ilustración de calma y meditación"
            className="image-placeholder img" /* Referenciamos la clase para el <img> */
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x350/a9d18e/000000?text=Momento+de+Calma"; }}
          />
        </div>
      </div>
      
      {/* Aplicamos la clase semántica 'navigation-links' */}
      <div className="navigation-links">
        <h2>Meditación</h2>
        <div className="links-row">
          
          {/* Usamos 'nav-link-home' */}
          <Link to="/new-meditation" className="nav-link-home">
            <span role="img" aria-label="libro" className="mr-2">📝</span> Registrar Sesión
          </Link>
          <span className="separator">|</span>
          <Link to="/history" className="nav-link-home">
            <span role="img" aria-label="historial" className="mr-2">📊</span> Ver Historial
          </Link>
          <span className="separator">|</span>
          <Link to="/instructions" className="nav-link-home">
            <span role="img" aria-label="luz" className="mr-2">💡</span> Instrucciones Básicas
          </Link>
        </div>
      </div>

      {/* Aplicamos la clase semántica 'info-section' */}
      <div className="info-section">
        <h3>¿Por qué meditar?</h3>
        <p>
          La práctica regular de la meditación ayuda a reducir el estrés, mejorar la concentración y fomentar una mayor conciencia de uno mismo y del entorno. Tómate un momento cada día, observa tu respiración y permítete estar presente.
        </p>
      </div>
    </div>
  );
};

export default Home;