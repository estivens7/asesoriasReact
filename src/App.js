import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './login';
import InicioEstudiante from './InicioEstudiante';
import MostrarHorario from './MostrarHorario';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/inicio-estudiante" element={<InicioEstudiante />} />
        <Route path="/horarios/:idProfesor" element={<MostrarHorario />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
