import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
import { useAuth } from '../context/AuthContext'; // Importamos el hook de autenticación
// Importamos el CSS si es necesario (el snippet sugiere que sí)
import './NewMeditation.css';

// Opciones de duración de meditación en minutos
const meditationOptions = [1, 2, 5, 10, 15, 30];

// ✨ URL base del backend
const API_BASE_URL = 'https://meditation-api-218f.onrender.com';

const NewMeditation = () => {
  // --- ESTADOS Y CONTEXTO ---
  const { authToken, logout } = useAuth(); // Obtenemos el token y la función de logout
  const navigate = useNavigate();

  const [durationInSeconds, setDurationInSeconds] = useState(0);
  const [isMeditating, setIsMeditating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [experience, setExperience] = useState('');
  const [meditationDate, setMeditationDate] = useState(new Date().toISOString().substring(0, 10)); // Fecha por defecto
  const [saveError, setSaveError] = useState('');

  // --- MANEJADORES DE VISTAS Y LÓGICA ---

  const selectTime = (durationMinutes) => {
    setDurationInSeconds(durationMinutes * 60);
    setIsMeditating(true);
    setIsFinished(false);
    setSaveError('');
    setExperience('');
  };

  const goBackToSelection = useCallback(() => {
    setIsMeditating(false);
    setIsFinished(false);
    setDurationInSeconds(0);
  }, []);

  const handleFinish = useCallback(() => {
    setIsMeditating(false);
    setIsFinished(true); // Muestra el formulario
  }, []);

  // Manejador del formulario para guardar la meditación en el backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveError('');

    // La duración está en segundos, la API espera minutos
    const durationMinutes = Math.round(durationInSeconds / 60);

    if (!authToken) {
      setSaveError('Error: No se encontró el token de autenticación. Por favor, inicia sesión de nuevo.');
      logout();
      return;
    }

    try {
      // 1. Petición POST usando fetch
      const response = await fetch(`${API_BASE_URL}/meditations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // ✨ USANDO EL TOKEN JWT
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          duration: durationMinutes,
          date: meditationDate,
          note: experience || null, // Envía null si el campo de nota está vacío
        }),
      });

      // 2. Manejo de la respuesta
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          // Token inválido o expirado. Forzamos el logout.
          logout();
          throw new Error('Tu sesión ha expirado. Por favor, vuelve a iniciar sesión.');
        }
        // Manejo de otros errores del backend (ej: 400 Bad Request)
        throw new Error(data.message || 'Error desconocido al guardar la meditación.');
      }

      // 3. Si es exitoso, redirigir al historial
      alert('¡Meditación registrada con éxito!');
      navigate('/history');

    } catch (err) {
      console.error('Error al guardar la meditación:', err);
      setSaveError(err.message);
    }
  };


  // --- RENDERING CONDICIONAL ---

  // 1. Vista del Timer
  if (isMeditating) {
    return (
      // Asumimos que Timer.jsx existe en el mismo directorio
      <Timer
        initialTime={durationInSeconds}
        onFinish={handleFinish}
        onBack={goBackToSelection}
      />
    );
  }

  // 2. Vista del Formulario (al finalizar la meditación)
  if (isFinished) {
    const durationMinutes = Math.round(durationInSeconds / 60);

    return (
      // Usamos la clase del snippet: .meditation-form-container
      <div className="meditation-form-container">
        <h1 className="text-3xl font-bold text-green-700 mb-2">Registro de Meditación</h1>
        <p className="subtitle">Guarda tu experiencia en el historial.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {saveError && <p className="text-red-500 text-center font-semibold border border-red-200 p-2 rounded-lg mb-4">{saveError}</p>}

          <div className="flex space-x-4">
            <div className="form-group w-1/2">
              <label htmlFor="duration" className="block text-gray-700 font-semibold mb-1">Duración (minutos):</label>
              <input
                type="number"
                id="duration"
                value={durationMinutes}
                readOnly
                // Usamos clases de Tailwind para un look 'desactivado'
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600 cursor-not-allowed"
              />
            </div>

            <div className="form-group w-1/2">
              <label htmlFor="date" className="block text-gray-700 font-semibold mb-1">Fecha de Meditación:</label>
              <input
                type="date"
                id="date"
                value={meditationDate}
                onChange={(e) => setMeditationDate(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="experience" className="block text-gray-700 font-semibold mb-1">Experiencia y Notas:</label>
            <textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              rows="6"
              placeholder="Describe cómo te sentiste, qué pensamientos surgieron..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>

          <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-150 shadow-md">
            Guardar Meditación
          </button>
          <button
            type="button"
            onClick={goBackToSelection}
            className="w-full py-2 mt-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-100 transition duration-150"
          >
            Cancelar y volver a seleccionar tiempo
          </button>
        </form>
      </div>
    );
  }

  // 3. Vista de Selección de Tiempo (Por defecto)
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-xl text-center mt-10">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Selecciona la duración de tu meditación 🧘
      </h1>
      <p className="text-gray-600 mb-8">
        Elige un tiempo y el temporizador comenzará automáticamente.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        {meditationOptions.map(minutes => (
          <button
            key={minutes}
            onClick={() => selectTime(minutes)}
            className="p-4 w-28 bg-green-500 text-white text-xl font-bold rounded-xl hover:bg-green-600 transition duration-150 shadow-lg transform hover:scale-105"
          >
            {minutes} min
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewMeditation;