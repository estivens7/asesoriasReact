import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import Header from './header';

function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rol, setRol] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    if (!correo || !contrasena || !rol) {
      setError('Completa todos los campos.');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo_electronico: correo, contrasena, rol }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Guardar usuario en localStorage si quieres
        localStorage.setItem('usuario', JSON.stringify(data.usuario));
        
        // Para este ejemplo, redirigimos a horarios con el id_usuario (supongamos que es idProfesor)
        // Puedes ajustar lógica para estudiantes o profesores.
        if (rol === 'profesor') {
          navigate(`/horarios/${data.usuario.id_usuario}`); // Asume id_usuario es idProfesor (ajustar según modelo)
        } else {
          navigate(`/inicio-estudiante`);
        }
      } else {
        setError(data.message || 'Error en login.');
      }
    } catch (error) {
      console.error('Error frontend:', error);
      setError('Error al conectar con el servidor.');
    }
  };

  return (
    <div><Header />
    
    <div className="login-container">
      
      <div className="login-box">
        <h2>Iniciar Sesión</h2>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
        <select value={rol} onChange={(e) => setRol(e.target.value)}>
          <option value="">Selecciona un rol</option>
          <option value="estudiante">Estudiante</option>
          <option value="profesor">Profesor</option>
        </select>
        <button onClick={handleLogin}>Ingresar</button>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
    </div>
  );
}

export default Login;
