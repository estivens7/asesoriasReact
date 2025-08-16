import express from 'express';
import cors from 'cors';
import pool from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

// Test DB connection
(async () => {
  try {
    const [result] = await pool.query('SELECT 1 + 1 AS result');
    console.log('✅ DB connection OK:', result[0].result);
  } catch (error) {
    console.error('❌ DB connection error:', error.message);
    process.exit(1);
  }
})();

// Login (validar solo tabla usuario)
app.post('/login', async (req, res) => {
  const { correo_electronico, contrasena, rol } = req.body;

  if (!correo_electronico || !contrasena || !rol) {
    return res.status(400).json({ success: false, message: 'Datos incompletos.' });
  }

  try {
    const query = `
      SELECT * FROM usuario WHERE correo_electronico = ? AND contrasena = ? AND rol = ?
    `;
    const [rows] = await pool.query(query, [correo_electronico, contrasena, rol]);

    if (rows.length > 0) {
      // Retornamos solo el usuario (sin contrasena)
      const usuario = rows[0];
      delete usuario.contrasena;
      res.json({ success: true, usuario });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
    }
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

// Obtener horarios por idProfesor
app.get('/horarios/:idProfesor', async (req, res) => {
  const { idProfesor } = req.params;

  if (!idProfesor || isNaN(idProfesor)) {
    return res.status(400).json({ message: 'ID de profesor inválido.' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT * FROM usuario INNER JOIN profesor ON usuario.id_usuario = profesor.id_usuario INNER JOIN horario ON profesor.id_profesor = horario.id_profesor where usuario.id_usuario = ?',
      [idProfesor]
    );

    if (rows.length > 0) {
      res.json({ horarios: rows });
    } else {
      res.status(404).json({ message: 'No se encontraron horarios para este profesor.' });
    }
  } catch (error) {
    console.error('Error en consulta horarios:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

app.post('/horarios/:idUsuario', async (req, res) => {
  const { idUsuario } = req.params;       // Recibes el id_usuario de la ruta
  const { fecha, hora_inicio, hora_fin } = req.body;

  // Validación simple de datos recibidos
  if (!fecha || !hora_inicio || !hora_fin) {
    return res.status(400).json({ message: 'Faltan datos obligatorios.' });
  }

  try {
    // Aquí va la consulta para obtener el id_profesor a partir del id_usuario
    const [result] = await pool.query(
      'SELECT id_profesor FROM profesor WHERE id_usuario = ?',
      [idUsuario]
    );

    if (result.length === 0) {
      // Si no encuentra profesor asociado, responde con error
          console.log('Usuario llegado es:', idUsuario);
      return res.status(404).json({ message: 'Profesor no encontrado para ese usuario.' });
    }

    // Guarda el id_profesor que obtuviste
    const id_profesor = result[0].id_profesor;

    // Inserta el nuevo horario con el id_profesor real
    const [insertResult] = await pool.query(
      'INSERT INTO horario (id_profesor, fecha, hora_inicio, hora_fin, disponible) VALUES (?, ?, ?, ?, 1)',
      [id_profesor, fecha, hora_inicio, hora_fin]
    );

    // Envía respuesta de éxito con los datos insertados
    res.status(201).json({
      id_horario: insertResult.insertId,
      id_profesor,
      fecha,
      hora_inicio,
      hora_fin,
      disponible: 1,
    });

  } catch (error) {
    console.error('Error al agregar horario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});


// routes/horarios.js
app.delete('/horarios/:id_horario', async (req, res) => {
  const { id_horario } = req.params;

  try {
    const [result] = await pool.query(
      'DELETE FROM horario WHERE id_horario = ?',
      [id_horario]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    res.json({ message: 'Horario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error eliminando el horario' });
  }
});


app.put("/horarios/:id", async (req, res) => {
  const { id } = req.params;
  const { fecha, hora_inicio, hora_fin, disponible } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE horario 
       SET fecha=?, hora_inicio=?, hora_fin=?, disponible=? 
       WHERE id_horario=?`,
      [fecha, hora_inicio, hora_fin, disponible, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Horario no encontrado" });
    }

    res.json({ message: "Horario actualizado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar horario" });
  }
});

app.listen(3001, () => {
  console.log('Servidor backend en http://localhost:3001');
});
