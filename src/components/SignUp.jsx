import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'; // Asume que estás usando axios

// ✨ Reemplaza con la URL base de tu backend (Render o Local)
const API_BASE_URL = 'http://localhost:3000/api/auth';

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Limpiar errores anteriores

        try {
            // 1. Enviar la petición POST al endpoint de registro
            const response = await axios.post(`${API_BASE_URL}/register`, {
                email,
                password,
            });

            // 2. Si es exitoso (código 201), guardar el token y redirigir
            const { token, user } = response.data;

            // Guardamos el token en localStorage para mantener la sesión
            localStorage.setItem('authToken', token);

            // Aquí también podrías guardar los datos del usuario (user.id, user.email) 
            // si los necesitas en el estado global.

            alert(`¡Bienvenido, ${user.email}! Registro exitoso.`);

            // Redirigir a la página de inicio o a la nueva meditación
            navigate('/');

        } catch (err) {
            console.error('Registration failed:', err);
            // 3. Manejar errores del backend (ej: 409 User already exists)
            const errorMessage = err.response?.data?.message || 'Error al registrar el usuario.';
            setError(errorMessage);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-xl shadow-2xl">
            <h1 className="text-3xl font-bold text-center text-green-700 mb-6">Crear Cuenta</h1>

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
                    Registrarse
                </button>
            </form>

            <p className="text-center text-gray-600 mt-4">
                ¿Ya tienes cuenta? <Link to="/login" className="text-green-600 hover:text-green-800 font-semibold">Inicia Sesión</Link>
            </p>
        </div>
    );
};

export default SignUp;