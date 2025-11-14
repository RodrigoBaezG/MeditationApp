import React, { useState, useCallback } from 'react';
import Timer from './Timer';

const meditationOptions = [1, 2, 5, 10, 15, 30];

const NewMeditation = () => {
  // --- ESTADOS ---
  const [durationInSeconds, setDurationInSeconds] = useState(0);
  // ✨ isTimeSelected se elimina, solo usamos isMeditating para el Timer
  const [isMeditating, setIsMeditating] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Estados para el formulario de registro
  const [experience, setExperience] = useState('');
  const [meditationDate, setMeditationDate] = useState('');

  // --- MANEJADORES DE VISTAS ---

  // 1. ✨ Selecciona el tiempo e INICIA el Timer inmediatamente
  const selectTime = (durationMinutes) => {
    setDurationInSeconds(durationMinutes * 60);
    setIsMeditating(true); // Monta el componente Timer
    setIsFinished(false);
  };

  // 2. Vuelve a la selección de tiempo (Usado por Timer.jsx en el botón "Atrás")
  const goBackToSelection = useCallback(() => {
    setIsMeditating(false);
    setDurationInSeconds(0);
  }, []); // Usamos useCallback para que sea una dependencia estable para Timer.jsx

  // 4. Se ejecuta al terminar el contador (callback de Timer)
  const handleTimerFinish = useCallback(() => {
    setIsMeditating(false);
    setIsFinished(true);
    setMeditationDate(new Date().toISOString().split('T')[0]);
  }, []);

  // 5. Se ejecuta al detener manualmente (callback de Timer)
  const handleTimerCancel = useCallback(() => {
    // Si se detiene desde el Timer (handleStop), volvemos a la selección
    setIsMeditating(false);
    setIsFinished(false);
    setDurationInSeconds(0);
  }, []);

  // 6. Guarda la nota en localStorage
  const handleSubmit = (e) => {
    e.preventDefault();

    // ... (lógica de guardado)
    const durationMinutes = durationInSeconds / 60;
    const newNote = { id: Date.now(), date: meditationDate, duration: durationMinutes, experience, };

    try {
      const existingNotes = JSON.parse(localStorage.getItem('meditationNotes') || '[]');
      const updatedNotes = [newNote, ...existingNotes];
      localStorage.setItem('meditationNotes', JSON.stringify(updatedNotes));
      alert(`¡Meditación de ${durationMinutes} minutos registrada con éxito!`);
      // Restablecer la vista
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
        // ✨ Nuevo prop para el botón "Atrás"
        onBack={goBackToSelection}
      />
    );
  }

  // 2. Si terminó (Formulario de registro)
  if (isFinished) {
    // ... (JSX del formulario de registro, sin cambios) ...
    return (
      <div className="max-w-lg mx-auto p-8 bg-white rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-2">
          ¡Meditación Completada! 🔔
        </h1>
        <p className="text-center text-lg text-gray-600 mb-8">
          Guarda tu experiencia de <span className="font-bold text-green-700">{durationInSeconds / 60} minutos</span>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label htmlFor="date" className="font-semibold text-gray-700 mb-1">Fecha:</label>
            <input id="date" type="date" value={meditationDate} onChange={(e) => setMeditationDate(e.target.value)} className="p-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" readOnly />
          </div>

          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 mb-1">Duración:</label>
            <input type="text" value={`${durationInSeconds / 60} minutos`} className="p-3 border border-gray-300 rounded-lg bg-green-50 text-green-700 font-bold cursor-not-allowed" readOnly />
          </div>

          <div className="flex flex-col">
            <label htmlFor="experience" className="font-semibold text-gray-700 mb-1">Experiencia y Notas:</label>
            <textarea id="experience" value={experience} onChange={(e) => setExperience(e.target.value)} rows="6" placeholder="Describe cómo te sentiste..." required className="p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"></textarea>
          </div>

          <button type="submit" className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-150 shadow-md">
            Guardar Nota
          </button>
        </form>
      </div>
    );
  }

  // 3. Vista de Selección de Tiempo (Por defecto)
  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-xl text-center">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        Selecciona tu Duración
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        Elige un tiempo para iniciar tu meditación.
      </p>

      <div className="flex flex-wrap justify-center gap-4">
        {meditationOptions.map(minutes => (
          <button
            key={minutes}
            onClick={() => selectTime(minutes)}
            className="p-4 bg-green-500 text-white text-xl font-semibold rounded-lg shadow-md hover:bg-green-600 transition duration-200 transform hover:scale-105 min-w-[120px]"
          >
            {minutes} Min
          </button>
        ))}
      </div>
    </div>
  );
};

export default NewMeditation;