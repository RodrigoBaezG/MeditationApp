import React, { useState, useEffect, useCallback } from 'react';
import './Timer.css'; // ✨ Importamos el nuevo CSS

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${paddedMinutes}:${paddedSeconds}`;
};

const Timer = ({ initialTime, onFinish, onCancel, onBack }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false); 
  const [isPaused, setIsPaused] = useState(false);

  const handleFinishCallback = useCallback(() => {
    new Audio('https://s3.amazonaws.com/iamnapo/audios/gong.mp3').play();
    onFinish(); 
  }, [onFinish]);

  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      handleFinishCallback();
      return; 
    }

    if (isRunning && !isPaused && timeLeft > 0) {
      const timerId = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
      
      return () => clearInterval(timerId);
    } 
    
  }, [isRunning, isPaused, timeLeft, handleFinishCallback]); 

  // --- Manejadores de Control ---
  
  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };
  
  const handlePause = () => { setIsPaused(true); };
  const handleContinue = () => { setIsPaused(false); };
  
  const handleStop = () => {
    setIsRunning(false); 
    onCancel(); 
  };

  const handleBack = () => {
    if (isRunning) setIsRunning(false); 
    onBack(); 
  };
  
  // --- Renderizado de Botones y Diseño ---
  const renderControlButtons = () => {
    
    if (!isRunning && timeLeft === initialTime) {
      return (
        <button 
          onClick={handleStart}
          // ✨ Usamos las clases semánticas
          className="control-button-base control-button-start-continue"
        >
          ▶️ Iniciar Meditación
        </button>
      );
    }

    if (isPaused) {
      return (
        <button 
          onClick={handleContinue}
          // ✨ Usamos las clases semánticas
          className="control-button-base control-button-start-continue"
        >
          ▶️ Continuar
        </button>
      );
    } 
    
    if (isRunning && !isPaused && timeLeft > 0) {
      return (
        <button 
          onClick={handlePause}
          // ✨ Usamos las clases semánticas
          className="control-button-base control-button-pause"
        >
          ⏸️ Pausar
        </button>
      );
    }
    
    return null;
  };

  return (
    // ✨ Clase semántica
    <div className="timer-container">
      
      {/* ✨ Clase semántica */}
      <button
        onClick={handleBack}
        className="back-button-corner"
      >
        ← Elegir otra
      </button>

      {/* ✨ Clase semántica */}
      <h1 className="timer-title">
        {isRunning ? (isPaused ? 'Meditación Pausada' : 'Meditando...') : 'Listo para iniciar'}
      </h1>
      
      {/* ✨ Clase semántica */}
      <div className="time-display">
        {formatTime(timeLeft)}
      </div>
      
      {renderControlButtons()}
      
      {/* ✨ Clase semántica */}
      <button 
        onClick={handleStop}
        className="stop-button"
      >
        ◼️ Detener
      </button>
    </div>
  );
};

export default Timer;