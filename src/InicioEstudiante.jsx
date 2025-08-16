import React from 'react';
import { useLocation } from 'react-router-dom';

function InicioEstudiante() {
  const location = useLocation();
  const usuario = location.state?.usuario;

  if (!usuario) {
    return <p>Error: No hay información del usuario.</p>;
  }

  return (
    <div>
      <h2>Bienvenido, {usuario.nombre}</h2>
      <p>Esta es la vista principal para estudiantes.</p>
    </div>
  );
}

export default InicioEstudiante;
