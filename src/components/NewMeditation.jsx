import React, { useState, useCallback } from 'react';
import Timer from './Timer';
import './NewMeditation.css'; // Importa el archivo CSS actualizado
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

const meditationOptions = [1, 2, 5, 10, 15, 30];

const NewMeditation = () => {
  const navigate = useNavigate();

  // --- ESTADOS ---
  const [durationInSeconds, setDurationInSeconds] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Estados para el formulario de registro
  const [experience, setExperience] = useState('');
  const [meditationDate, setMeditationDate] = useState('');

  // --- MANEJADORES DE VISTAS ---

  // Selecciona el tiempo e INICIA el Timer inmediatamente
  const selectTime = (durationMinutes) => {
    setDurationInSeconds(durationMinutes * 60);
    setIsMeditating(true); 
    setIsFinished(false);
  };

  // Vuelve a la selección de tiempo (Usado por Timer.jsx en el botón "Atrás")
  const goBackToSelection = useCallback(() => {
    setIsMeditating(false);
    setDurationInSeconds(0);
  }, []);

  // Función para ir a la Home (asumiendo que la ruta es '/')
  const goToHome = () => {
    navigate('/');
  };

  // Se ejecuta al terminar el contador (callback de Timer)
  const handleTimerFinish = useCallback(() => {
    setIsMeditating(false);
    setIsFinished(true);
    setMeditationDate(new Date().toISOString().split('T')[0]);
  }, []);

  // Se ejecuta al detener manualmente (callback de Timer)
  const handleTimerCancel = useCallback(() => {
    setIsMeditating(false);
    setIsFinished(false);
    setDurationInSeconds(0);
  }, []);

  // Guarda la nota en localStorage
  const handleSubmit = (e) => {
    e.preventDefault();

    const durationMinutes = durationInSeconds / 60;
    const newNote = { id: Date.now(), date: meditationDate, duration: durationMinutes, experience, };

    try {
      const existingNotes = JSON.parse(localStorage.getItem('meditationNotes') || '[]');
      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem('meditationNotes', JSON.stringify(updatedNotes));
      alert(`¡Meditación de ${durationMinutes} minutos registrada con éxito!`);
      
      setIsFinished(false);
      setDurationInSeconds(0);
      setExperience('');
      setMeditationDate('');
    } catch (error) {
      console.error("Error al guardar en LocalStorage:", error);
      alert('Error al guardar la nota. Revisa la consola.');
    }
  };

  // --- RENDERIZADO CONDICIONAL ---

  // 1. Si está meditando, renderiza el Timer
  if (isMeditating) {
    return (
      <Timer
        initialTime={durationInSeconds}
        onFinish={handleTimerFinish}
        onCancel={handleTimerCancel}
        onBack={goBackToSelection}
      />
    );
  }

  // 2. Si terminó (Formulario de registro)
  if (isFinished) {
    const durationMinutes = durationInSeconds / 60;
    return (
      // CLASE SEMÁNTICA: Contenedor principal del formulario
      <div className="meditation-form-container">
        <h1 className="form-title">
          ¡Meditación Completada! 🔔
        </h1>
        <p className="form-subtitle">
          Guarda tu experiencia de <span className="font-bold text-green-700">{durationMinutes} minutos</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo de Fecha */}
          <div className="form-group">
            <label htmlFor="date" className="form-label">Fecha:</label>
            <input 
              id="date" 
              type="date" 
              value={meditationDate} 
              onChange={(e) => setMeditationDate(e.target.value)} 
              // CLASE SEMÁNTICA: Input deshabilitado
              className="form-input-base date-input-disabled" 
              readOnly 
            />
          </div>

          {/* Campo de Duración */}
          <div className="form-group">
            <label className="form-label">Duración:</label>
            <input 
              type="text" 
              value={`${durationMinutes} minutos`} 
              // CLASE SEMÁNTICA: Input de información
              className="form-input-base duration-info-input" 
              readOnly 
            />
          </div>

          {/* Campo de Experiencia */}
          <div className="form-group">
            <label htmlFor="experience" className="form-label">Experiencia y Notas:</label>
            <textarea 
              id="experience" 
              value={experience} 
              onChange={(e) => setExperience(e.target.value)} 
              rows="6" 
              placeholder="Describe cómo te sentiste..." 
              required 
              // CLASE SEMÁNTICA: Input base
              className="form-input-base"
            ></textarea>
          </div>

          <button 
            type="submit" 
            // CLASE SEMÁNTICA: Botón de envío
            className="submit-button"
          >
            Guardar Nota
          </button>
        </form>
      </div>
    );
  }

  // 3. Vista de Selección de Tiempo (Por defecto)
  return (
    // CLASE SEMÁNTICA: Contenedor de selección
    <div className="selection-container">
      <h1 className="selection-title">
        Select duration 🧘
      </h1>

      <div className="selection-button-grid">
        {meditationOptions.map(minutes => (
          <button
            key={minutes}
            onClick={() => selectTime(minutes)}
            // CLASE SEMÁNTICA: Botón de duración
            className="duration-button"
          >
            {minutes} Min
          </button>
        ))}
      </div>
      
      {/* Botón Volver a Inicio (Mantenemos la clase semántica si la definiste, o la creamos) */}
      <button
        onClick={goToHome}
        className="back-to-home-link"
      >
        ← Volver a Inicio
      </button>
    </div>
  );
};

export default NewMeditation;