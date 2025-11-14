import React from 'react';
import './Instructions.css'; // Importa el archivo CSS

const Instructions = () => {
  return (
    <div className="instructions-container">
      <h1>Guía Básica para la Meditación</h1>
      <p className="intro-text">
        Bienvenido/a. Tómate unos minutos para relajarte y encontrar un espacio tranquilo. Estas son las instrucciones fundamentales para comenzar tu práctica.
      </p>

      <div className="step-card">
        <h2>1. Encuentra tu Postura</h2>
        <ul>
          <li>Siéntate en una silla con los pies planos en el suelo o en un cojín con las piernas cruzadas.</li>
          <li>Mantén la espalda **recta pero no rígida**. Imagina un hilo tirando suavemente de tu coronilla hacia el cielo.</li>
          <li>Las manos pueden descansar suavemente sobre tus muslos o regazo.</li>
        </ul>
      </div>

      <div className="step-card">
        <h2>2. Cierra los Ojos Suavemente</h2>
        <ul>
          <li>Cierra los ojos o déjalos ligeramente entreabiertos con la mirada fija en el suelo, a unos metros de distancia.</li>
          <li>Esto ayuda a **minimizar las distracciones** visuales y dirigir tu atención hacia adentro.</li>
        </ul>
      </div>
      
      <div className="step-card">
        <h2>3. Concéntrate en la Respiración</h2>
        <ul>
          <li>Dirige tu atención a la **sensación de la respiración**. Siente el aire entrar y salir por tu nariz o el movimiento de tu abdomen.</li>
          <li>No intentes cambiar tu respiración; simplemente obsérvala tal como es: **sin esfuerzo, natural**.</li>
        </ul>
      </div>

      <div className="step-card">
        <h2>4. Maneja la Distracción (El 'Mono Loco')</h2>
        <ul>
          <li>Es normal que la mente divague (pensamientos, ruidos, sensaciones). Esto es parte del proceso.</li>
          <li>Cuando notes que tu mente se ha ido, **reconoce el pensamiento sin juzgarlo** y gentilmente, pero con firmeza, **devuelve tu atención a la respiración**.</li>
        </ul>
      </div>
      
      <p className="closing-text">
        Comienza con 5 o 10 minutos al día. La clave es la **consistencia**. ¡Feliz práctica!
      </p>
    </div>
  );
};

export default Instructions;