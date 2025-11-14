import React, { useState, useEffect, useCallback } from 'react';

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(remainingSeconds).padStart(2, '0');
  
  return `${paddedMinutes}:${paddedSeconds}`;
};

const Timer = ({ initialTime, onFinish, onCancel, onBack }) => { // ✨ Recibimos onBack
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false); 
  const [isPaused, setIsPaused] = useState(false);

  // ... (handleFinishCallback se mantiene igual) ...
  const handleFinishCallback = useCallback(() => {
    new Audio('https://s3.amazonaws.com/iamnapo/audios/gong.mp3').play();
    onFinish(); 
  }, [onFinish]);


  // ... (Lógica del Temporizador useEffect se mantiene igual) ...
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
  
  // Detiene y cancela la sesión (vuelve a la vista de selección - onCancel)
  const handleStop = () => {
    setIsRunning(false); 
    onCancel(); 
  };

  // ✨ Manejador para el botón "Atrás"
  const handleBack = () => {
    // Detener si está corriendo, aunque onBack hará que se desmonte
    if (isRunning) setIsRunning(false); 
    onBack(); // Llama a goBackToSelection del padre
  };
  
  // --- Renderizado de Botones y Diseño ---
  const renderControlButtons = () => {
    // ... (lógica de renderizado de botones, se mantiene igual) ...
    
    if (!isRunning && timeLeft === initialTime) {
      return (
        <button 
          onClick={handleStart}
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-150 shadow-md transform hover:scale-105"
        >
          ▶️ Iniciar Meditación
        </button>
      );
    }

    if (isPaused) {
      return (
        <button 
          onClick={handleContinue}
          className="px-8 py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition duration-150 shadow-md transform hover:scale-105"
        >
          ▶️ Continuar
        </button>
      );
    } 
    
    if (isRunning && !isPaused && timeLeft > 0) {
      return (
        <button 
          onClick={handlePause}
          className="px-8 py-3 bg-yellow-500 text-white font-bold rounded-lg hover:bg-yellow-600 transition duration-150 shadow-md transform hover:scale-105"
        >
          ⏸️ Pausar
        </button>
      );
    }
    
    return null;
  };

  return (
    <div className="max-w-md mx-auto p-8 bg-white rounded-xl shadow-2xl text-center relative"> {/* Añadimos relative */}
      
      {/* ✨ Botón "Atrás" en la esquina superior izquierda */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 text-gray-500 hover:text-gray-800 transition duration-150 text-sm font-semibold"
      >
        ← Elegir otra
      </button>

      <h1 className="text-4xl font-bold text-green-700 mb-6 mt-4">
        {isRunning ? (isPaused ? 'Meditación Pausada' : 'Meditando...') : 'Listo para iniciar'}
      </h1>
      
      <div className="text-8xl font-mono text-green-900 mb-10 p-6 border-4 border-green-300 rounded-full inline-block bg-green-50 shadow-inner">
        {formatTime(timeLeft)}
      </div>
      
      {renderControlButtons()}
      
      <button 
        onClick={handleStop}
        className="mt-8 ml-4 px-6 py-2 text-sm text-red-600 border border-red-600 rounded-full hover:bg-red-50 transition duration-150"
      >
        ◼️ Detener
      </button>
    </div>
  );
};

export default Timer;