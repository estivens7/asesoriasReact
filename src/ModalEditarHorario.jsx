import { useState } from "react";
import './ModalEditar.css'

export default function ModalEditarHorario({ onClose, horario, onHorarioEditado }) {
  const [fecha, setFecha] = useState(horario.fecha);
  const [horaInicio, setHoraInicio] = useState(horario.hora_inicio);
  const [horaFin, setHoraFin] = useState(horario.hora_fin);
  const [disponible, setDisponible] = useState(horario.disponible);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const handleEditar = async () => {
    setCargando(true);
    setError(null);

    try {
      const res = await fetch(`http://localhost:3001/horarios/${horario.id_horario}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fecha,
          hora_inicio: horaInicio,
          hora_fin: horaFin,
          disponible
        })
      });

      if (!res.ok) throw new Error("Error al actualizar horario");

      onHorarioEditado({
        ...horario,
        fecha,
        hora_inicio: horaInicio,
        hora_fin: horaFin,
        disponible
      });

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Editar Horario</h2>

        <label>Fecha:</label>
        <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />

        <label>Hora inicio:</label>
        <input type="time" value={horaInicio} onChange={(e) => setHoraInicio(e.target.value)} />

        <label>Hora fin:</label>
        <input type="time" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} />

        <label>Disponible:</label>
        <select value={disponible} onChange={(e) => setDisponible(parseInt(e.target.value))}>
          <option value={1}>Sí</option>
          <option value={0}>No</option>
        </select>

        {error && <p className="error">{error}</p>}

        <button onClick={handleEditar} disabled={cargando}>
          {cargando ? "Guardando..." : "Guardar cambios"}
        </button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
}
