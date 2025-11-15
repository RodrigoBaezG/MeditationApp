import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home'; 
import Instructions from './components/Instructions';
import NewMeditation from './components/NewMeditation';
import History from './components/History'; // ✨ Nuevo Import
import './App.css';

function App() {
  return (
    // Aplicamos la clase semántica 'app-container'
    <Router>
      <div className="app-container">
        
        {/* Aplicamos la clase semántica 'main-header' */}
        <header className="main-header">
          {/* Aplicamos la clase semántica 'navbar-nav' */}
          <nav className="navbar-nav">
            {/* Aplicamos la clase semántica 'nav-list' */}
            <ul className="nav-list">
              <li>
                <Link to="/" className="nav-link">Home</Link>
              </li>
              <li>
                <Link to="/instructions" className="nav-link">Instructions</Link>
              </li>
              <li>
                <Link to="/new-meditation" className="nav-link">Ne meditation</Link>
              </li>
              <li>
                <Link to="/history" className="nav-link">History</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home />} /> 
            <Route path="/instructions" element={<Instructions />} />
            <Route path="/new-meditation" element={<NewMeditation />} />
            {/* ✨ Nueva Ruta */}
            <Route path="/history" element={<History />} /> 
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;