import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './components/Home'; // Asume que tienes un componente Home.jsx
import NewMeditation from './components/NewMeditation';
import History from './components/History'; // Asume que tienes un componente History.jsx
import Login from './components/Login'; // Componente de Login (generado antes)
import SignUp from './components/SignUp'; // Componente de Registro (generado antes)
import Navbar from './components/Navbar'; // Un componente de navegación que crearemos

// =======================================================
// Componente de Utilidad para Proteger Rutas
// =======================================================
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Muestra un loader mientras se revisa el token en localStorage
    return (
      <div className="flex justify-center items-center h-screen text-2xl font-semibold text-green-700">
        Cargando sesión...
      </div>
    );
  }

  // Si no está autenticado, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, muestra la ruta solicitada
  return children;
};

// =======================================================
// Componente Navbar (Simple, para demostrar logout)
// =======================================================
const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  return (
    <nav className="bg-green-800 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold hover:text-green-200 transition duration-150">
          Letting Be
        </Link>
        <div className="flex space-x-4">
          <Link to="/instructions" className="text-white hover:text-green-200 transition duration-150">
            Instrucciones
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/new-meditation" className="text-white hover:text-green-200 transition duration-150">
                Meditar
              </Link>
              <Link to="/history" className="text-white hover:text-green-200 transition duration-150">
                Historial
              </Link>
              <button
                onClick={logout}
                className="text-red-300 hover:text-red-500 font-semibold transition duration-150"
              >
                Cerrar Sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white hover:text-green-200 transition duration-150">
                Iniciar Sesión
              </Link>
              <Link to="/signup" className="text-white hover:text-green-200 transition duration-150">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};


// =======================================================
// Componente Principal de la Aplicación
// =======================================================
const App = () => {
  return (
    // Se envuelve toda la aplicación en el Router
    <Router>
      {/* Se envuelve la app en el AuthProvider para que todas las rutas usen el contexto */}
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
};

// Componente para usar el hook de navegación dentro del Router
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <Navbar />
      <main className="container mx-auto p-4">
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/instructions" element={<Home />} /> {/* Asumiendo que Home tiene las instrucciones */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Rutas Protegidas */}
          <Route
            path="/new-meditation"
            element={<ProtectedRoute><NewMeditation /></ProtectedRoute>}
          />
          <Route
            path="/history"
            element={<ProtectedRoute><History /></ProtectedRoute>}
          />

          {/* Redirigir cualquier otra cosa a Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;