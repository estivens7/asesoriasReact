import React from 'react';
import './Header.css';
import { useParams, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
  return (
    <header className="header">
      <h1>Sistema de Asesorías</h1>
            <button onClick={() => {
        localStorage.removeItem('usuario');
        navigate('/');
      }}>Cerrar sesión</button>
    </header>
  );
}

export default Header;
