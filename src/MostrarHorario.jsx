import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from './header';
import './Login.css';
import ModalHorario from './ModalHorario';
import ModalEditarHorario from "./ModalEditarHorario";

function MostrarHorario() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const { idProfesor } = useParams();
  const [horarios, setHorarios] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [horarioEditar, setHorarioEditar] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/horarios")
      .then(res => res.json())
      .then(data => setHorarios(data));
  }, []);

  const handleHorarioEditado = (horarioActualizado) => {
    setHorarios(horarios.map(h => h.id_horario === horarioActualizado.id_horario ? horarioActualizado : h));
  };

  const handleEliminar = async (id_horario) => {
    if (!window.confirm("¿Seguro que quieres eliminar este horario?")) return;

    try {
      const res = await fetch(`http://localhost:3001/horarios/${id_horario}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error eliminando horario");

      setHorarios((prev) => prev.filter((h) => h.id_horario !== id_horario));
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // NUEVO: función para abrir modal de edición
  const handleEditar = (horario) => {
    setHorarioEditar(horario); // Guardamos el horario que vamos a editar
    setModalEditarOpen(true); // Abrimos el modal
  };

  const cargarHorarios = async () => {
    const res = await fetch(`http://localhost:3001/horarios/${idProfesor}`);
    const data = await res.json();
    setHorarios(data.horarios);
  };

  useEffect(() => {
    cargarHorarios();
  }, [idProfesor]);

  const handleNuevoHorario = (nuevoHorario) => {
    setHorarios((prev) => [...prev, nuevoHorario]);
  };

  useEffect(() => {
    if (!idProfesor) {
      setError('ID de profesor no proporcionado.');
      return;
    }

    const fetchHorarios = async () => {
      try {
        const res = await fetch(`http://localhost:3001/horarios/${idProfesor}`);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Error al obtener horarios.');
        }
        const data = await res.json();
        setHorarios(data.horarios);
      } catch (err) {
        console.error('Error frontend:', err);
        setError(err.message || 'Error al cargar horarios.');
      }
    };

    fetchHorarios();
  }, [idProfesor]);

  return (



    < div className='principal'>
      {modalOpen && <ModalHorario onClose={() => setModalOpen(false)} idProfesor={idProfesor} />}
            {modalEditarOpen && horarioEditar && (
        <ModalEditarHorario
          horario={horarioEditar}
          onClose={() => setModalEditarOpen(false)}
          onHorarioEditado={handleHorarioEditado}
        />
      )}
      <Header />
      <div className='container'>
        <h2>Profesor</h2>
        <p>su tiempo para asesorias es: </p>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {horarios.length > 0 ? (
          <table border="1" cellPadding="8">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Disponible</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {horarios.map(h => (
                <tr key={h.id_horario}>
                  <td>{new Date(h.fecha).toLocaleDateString()}</td>
                  <td>{h.hora_inicio}</td>
                  <td>{h.hora_fin}</td>
                  <td>{h.disponible ? 'Sí' : 'No'}</td>
                  <td>
                    <button
                      className="eliminar"
                      onClick={() => handleEliminar(h.id_horario)}
                    >
                      Eliminar
                    </button>
                    <button className="editar" onClick={() => handleEditar(h)}>Editar</button>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        ) : (
          !error && <p>No hay horarios disponibles.</p>
        )}

        <button onClick={() => setModalOpen(true)} className="Agregar">Agregar Disponibilidad</button>
      </div>

    </div>


  );
}

export default MostrarHorario;
