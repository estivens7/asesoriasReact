import React, { useState } from 'react';
import './ModalHorario.css';

export default function ModalHorario({ onClose, idProfesor, onNuevoHorario }) {
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha || !horaInicio || !horaFin) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    setCargando(true);
    setError(null);

    try {
    const response = await fetch(`http://localhost:3001/horarios/${idProfesor}`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
    }),
    });


      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al agregar horario');
      }

      const nuevoHorario = await response.json();

      // Avisar al componente padre para actualizar la lista
      if (onNuevoHorario) onNuevoHorario(nuevoHorario);

      // Cerrar modal
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2>Registrar Nuevo Horario</h2>

        <form onSubmit={handleSubmit}>
          <label>
            Fecha:
            <input
              type="date"
              name="fecha"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </label>

          <label>
            Hora Inicio:
            <input
              type="time"
              name="hora_inicio"
              value={horaInicio}
              onChange={(e) => setHoraInicio(e.target.value)}
              required
            />
          </label>

          <label>
            Hora Fin:
            <input
              type="time"
              name="hora_fin"
              value={horaFin}
              onChange={(e) => setHoraFin(e.target.value)}
              required
            />
          </label>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Agregando...' : 'Agregar'}
          </button>
          <button type="button" onClick={onClose} disabled={cargando}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
}
