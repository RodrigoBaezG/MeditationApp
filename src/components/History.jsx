import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './History.css'; // ✨ Importamos el nuevo CSS

// Función auxiliar para formatear minutos totales a Horas y Minutos (HH:MM)
const formatTotalTime = (totalMinutes) => {
    if (totalMinutes < 60) {
        return `${totalMinutes} minutes`;
    }
    const hours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    
    // Construir la cadena de tiempo
    let timeString = '';
    if (hours > 0) {
        timeString += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    if (remainingMinutes > 0) {
        if (hours > 0) timeString += ' y ';
        timeString += `${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
    }
    
    return timeString.trim();
};

const History = () => {
    const [notes, setNotes] = useState([]);
    const [totalTime, setTotalTime] = useState(0); 

    useEffect(() => {
        const loadNotes = () => {
            try {
                const storedNotes = localStorage.getItem('meditationNotes');
                if (storedNotes) {
                    const parsedNotes = JSON.parse(storedNotes);
                    setNotes(parsedNotes);
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        // ✨ CLASE SEMÁNTICA: history-container
        <div className="history-container">
            {/* ✨ CLASE SEMÁNTICA: history-title */}
            <h1 className="history-title">
                Meditation record 🧘
            </h1>
            
            {/* SECCIÓN DE RESUMEN DEL TIEMPO TOTAL */}
            {/* ✨ CLASE SEMÁNTICA: total-time-summary */}
            <div className="total-time-summary">
                {/* ✨ CLASE SEMÁNTICA: summary-title */}
                <h2 className="summary-title">
                    Total Time Meditated:
                </h2>
                {/* ✨ CLASE SEMÁNTICA: summary-value */}
                <p className="summary-value">
                    {formatTotalTime(totalTime)}
                </p>
            </div>
            
            {notes.length === 0 ? (
                // ✨ CLASE SEMÁNTICA: empty-state
                <div className="empty-state">
                    {/* ✨ CLASE SEMÁNTICA: empty-state-text */}
                    <p className="empty-state-text">
                        Not meditated yet. Start your first session!
                    </p>
                    <Link 
                        to="/new-meditation" 
                        // ✨ CLASE SEMÁNTICA: call-to-action-link
                        className="call-to-action-link"
                    >
                        New meditation session
                    </Link>
                </div>
            ) : (
                // ✨ CLASE SEMÁNTICA: notes-list-wrapper
                <div className="notes-list-wrapper">
                    {notes.map((note) => (
                        // ✨ CLASE SEMÁNTICA: note-card
                        <div key={note.id} className="note-card">
                            {/* ✨ CLASE SEMÁNTICA: note-info-group */}
                            <div className="note-info-group">
                                {/* ✨ CLASES SEMÁNTICAS: note-date & note-date-label */}
                                <p className="note-date">
                                    <span className="note-date-label">Date:</span> {formatDate(note.date)}
                                </p>
                                {/* ✨ CLASE SEMÁNTICA: note-duration */}
                                <p className="note-duration">
                                    {note.duration} minutes
                                </p>
                                {/* ✨ CLASE SEMÁNTICA: note-experience */}
                                <p className="note-experience">
                                    {note.experience || "Not notes yet."}
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