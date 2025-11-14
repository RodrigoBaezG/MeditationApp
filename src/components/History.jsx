import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import './History.css'; // Asumimos que usamos Tailwind Utilities

// Función auxiliar para formatear minutos totales a Horas y Minutos (HH:MM)
const formatTotalTime = (totalMinutes) => {
    if (totalMinutes < 60) {
        return `${totalMinutes} minutos`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    // Construir la cadena de tiempo
    let timeString = '';
    if (hours > 0) {
        timeString += `${hours} hora${hours !== 1 ? 's' : ''}`;
    }
    if (remainingMinutes > 0) {
        if (hours > 0) timeString += ' y ';
        timeString += `${remainingMinutes} minuto${remainingMinutes !== 1 ? 's' : ''}`;
    }
    
    return timeString.trim();
};

const History = () => {
    const [notes, setNotes] = useState([]);
    const [totalTime, setTotalTime] = useState(0); // ✨ Estado para el tiempo total

    // useEffect para cargar notas y calcular el total
    useEffect(() => {
        const loadNotes = () => {
            try {
                const storedNotes = localStorage.getItem('meditationNotes');
                if (storedNotes) {
                    const parsedNotes = JSON.parse(storedNotes);
                    setNotes(parsedNotes);

                    // ✨ Cálculo del tiempo total
                    const totalDuration = parsedNotes.reduce((sum, note) => sum + note.duration, 0);
                    setTotalTime(totalDuration);
                } else {
                    setNotes([]);
                    setTotalTime(0);
                }
            } catch (error) {
                console.error("Error al cargar notas de LocalStorage:", error);
                setNotes([]);
                setTotalTime(0);
            }
        };
        
        loadNotes();
    }, []);

    // Función para formatear la fecha a un formato legible
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl space-y-6">
            <h1 className="text-4xl font-bold text-center text-green-800 border-b pb-4 mb-4">
                Historial de Meditación 🧘
            </h1>
            
            {/* ✨ SECCIÓN DE RESUMEN DEL TIEMPO TOTAL */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-green-800 mb-2">
                    Tiempo Total Meditado:
                </h2>
                <p className="text-4xl font-extrabold text-green-700">
                    {formatTotalTime(totalTime)}
                </p>
            </div>
            {/* ------------------------------------- */}

            {notes.length === 0 ? (
                <div className="text-center p-10 bg-gray-50 rounded-lg">
                    <p className="text-lg text-gray-600 mb-4">
                        Aún no tienes notas registradas.
                    </p>
                    <Link 
                        to="/new-meditation" 
                        className="text-white bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition duration-150 font-semibold"
                    >
                        Comenzar una nueva meditación
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {notes.map((note) => (
                        <div key={note.id} className="p-5 bg-white border-l-4 border-green-600 rounded-lg shadow-md flex justify-between items-start">
                            <div className="flex-grow">
                                <p className="text-sm text-gray-500 mb-1">
                                    <span className="font-bold text-gray-700">Fecha:</span> {formatDate(note.date)}
                                </p>
                                <p className="text-lg font-semibold text-green-700 mb-2">
                                    {note.duration} minutos
                                </p>
                                <p className="text-gray-700 italic border-t pt-2 mt-2">
                                    {note.experience || "Sin notas de experiencia."}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;