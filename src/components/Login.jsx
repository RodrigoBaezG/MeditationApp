import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Asume que estás usando axios

// ✨ Reemplaza con la URL base de tu backend (Render o Local)
const API_BASE_URL = 'http://localhost:3000/api/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            // 1. Enviar la petición POST al endpoint de login
            const response = await axios.post(`${API_BASE_URL}/login`, {
                email,
                password,
            });

            // 2. Si es exitoso (código 200), guardar el token y redirigir
            const { token, user } = response.data;

            // Guardamos el token en localStorage para mantener la sesión
            localStorage.setItem('authToken', token);

            // Aquí, idealmente, también actualizarías el estado global de autenticación

            alert(`Sesión iniciada como: ${user.email}`);
            navigate('/'); // Redirigir a la página de inicio

        } catch (err) {
            console.error('Login failed:', err);
            // 3. Manejar errores del backend (ej: 401 Invalid credentials)
            const errorMessage = err.response?.data?.message || 'Error al iniciar sesión. Verifica tus credenciales.';
            setError(errorMessage);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl">
            <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Iniciar Sesión</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {error && <p className="text-red-500 text-center font-semibold border border-red-200 p-2 rounded-lg">{error}</p>}

                <div>
                    <label className="block text-gray-700 font-semibold mb-1" htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 font-semibold mb-1" htmlFor="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition duration-150 shadow-md"
                >
                    Iniciar Sesión
                </button>
            </form>

            <p className="text-center text-gray-600 mt-4">
                ¿No tienes cuenta? <Link to="/signup" className="text-green-600 hover:text-green-800 font-semibold">Regístrate</Link>
            </p>
        </div>
    );
};

export default Login;