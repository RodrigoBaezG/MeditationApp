import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Para obtener el token
// import './History.css'; // Si usas un archivo CSS separado, descomenta

// ✨ URL base del backend
const API_BASE_URL = 'http://localhost:3000/api';

// =======================================================
// 1. Funciones Auxiliares
// =======================================================

// Función para formatear la fecha de la base de datos (YYYY-MM-DD)
const formatDate = (dateString) => {
    // Usamos Intl.DateTimeFormat para una salida legible
    return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
};

// Función para formatear minutos totales a Horas y Minutos (ej: 2 horas y 30 minutos)
const formatTotalTime = (totalMinutes) => {
    if (totalMinutes < 60) {
        return `${totalMinutes} minutos`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

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


// =======================================================
// 2. Componente Principal
// =======================================================
const History = () => {
    const { authToken, logout } = useAuth();
    const [meditations, setMeditations] = useState([]);
    const [totalTime, setTotalTime] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // Función para cargar los datos desde el backend
    const loadMeditationHistory = useCallback(async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/meditations`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // ✨ ENVÍO DEL TOKEN: Es clave para la autenticación
                    'Authorization': `Bearer ${authToken}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // Si el token es inválido/expirado, forzar el logout
                    logout();
                    throw new Error('Sesión expirada. Por favor, inicia sesión.');
                }
                throw new Error(data.message || 'Error al cargar el historial.');
            }

            // 3. Procesar datos exitosos
            setMeditations(data);

            // 4. Calcular el tiempo total
            const totalMinutes = data.reduce((sum, med) => sum + med.duration_minutes, 0);
            setTotalTime(totalMinutes);

        } catch (err) {
            console.error('Error al cargar historial:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [authToken, logout]);

    // Ejecutar la carga al montar el componente
    useEffect(() => {
        // Solo cargamos si tenemos un token disponible
        if (authToken) {
            loadMeditationHistory();
        }
    }, [authToken, loadMeditationHistory]);


    // --- RENDERING CONDICIONAL ---

    if (isLoading) {
        return (
            <div className="text-center mt-10 text-xl text-green-700">
                Cargando tu historial de meditaciones...
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-md mx-auto mt-10 p-8 bg-red-100 text-red-700 border border-red-400 rounded-lg">
                <p className="font-bold">Error de Carga:</p>
                <p>{error}</p>
                {error.includes('expirada') && (
                    <button onClick={logout} className="mt-4 text-sm text-red-500 hover:underline">
                        Ir a Iniciar Sesión
                    </button>
                )}
            </div>
        );
    }

    // Vista principal
    return (
        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-2xl mt-10">
            <h1 className="text-4xl font-extrabold text-center text-green-800 mb-4">
                Tu Historial de Meditación 📈
            </h1>

            {/* Resumen de estadísticas */}
            <div className="bg-green-50 p-6 rounded-lg shadow-inner mb-8 text-center border border-green-200">
                <p className="text-xl font-semibold text-green-700">
                    Sesiones Completadas: <span className="text-green-900 font-extrabold">{meditations.length}</span>
                </p>
                <p className="text-xl font-semibold text-green-700 mt-2">
                    Tiempo Total Acumulado: <span className="text-green-900 font-extrabold">{formatTotalTime(totalTime)}</span>
                </p>
            </div>

            {/* Si no hay meditaciones */}
            {meditations.length === 0 ? (
                <div className="text-center p-10 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                    <p className="text-xl text-gray-600 mb-4">
                        Aún no tienes meditaciones registradas.
                    </p>
                    <Link
                        to="/new-meditation"
                        className="inline-block text-white bg-green-600 px-6 py-3 rounded-full hover:bg-green-700 transition duration-150 font-semibold shadow-lg"
                    >
                        Comenzar mi primera meditación
                    </Link>
                </div>
            ) : (
                // Lista de tarjetas de meditación
                <div className="space-y-4">
                    {meditations.map((med) => (
                        <div key={med.id} className="p-5 bg-white border-l-4 border-green-600 rounded-lg shadow-md flex justify-between items-start hover:shadow-lg transition duration-200">
                            <div className="flex-grow">
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-sm text-gray-500 font-medium">
                                        Fecha: <span className="text-gray-700 font-semibold">{formatDate(med.meditation_date)}</span>
                                    </p>
                                    <span className="text-lg font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
                                        {med.duration_minutes} min
                                    </span>
                                </div>
                                <p className="text-gray-700 italic border-t pt-2 mt-2">
                                    {med.note || "— Sin notas de experiencia. —"}
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