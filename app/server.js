const express = require('express');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'biblio',
  password: process.env.DB_PASSWORD || 'biblio123',
  database: process.env.DB_NAME || 'biblioteca',
  waitForConnections: true,
  connectionLimit: 10
});

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fecha = d => d ? new Date(d).toISOString().slice(0, 10) : '';

function layout(titulo, cuerpo) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titulo)} · Biblioteca Docker</title>
<link rel="stylesheet" href="/estilos.css"></head><body>
<header><h1>📚 Biblioteca</h1>
<nav><a href="/">Registrar libro</a><a href="/libros">Ver base de datos</a><a href="/autores">Autores</a></nav></header>
<main>${cuerpo}</main>
<footer>Ejecutándose en contenedor Docker · host: ${esc(require('os').hostname())}</footer>
</body></html>`;
}

// ---- Enlace 1: formulario para ingresar datos ----
app.get('/', async (req, res) => {
  const [autores] = await pool.query('SELECT id_autor, nombre FROM autores ORDER BY nombre');
  const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM libros');
  const opciones = autores.map(a => `<option value="${a.id_autor}">${esc(a.nombre)}</option>`).join('');
  const msg = req.query.ok ? '<p class="ok">✅ Libro guardado en la base de datos.</p>' : '';
  res.send(layout('Registrar libro', `
    <h2>Registrar libro</h2>${msg}
    <p class="info">Libros guardados hasta ahora: <strong>${total}</strong> (meta de la actividad: 15)</p>
    <form method="post" action="/libros">
      <label>Título <input name="titulo" required maxlength="150"></label>
      <label>Autor <select name="id_autor" required>${opciones}</select></label>
      <label>Fecha de publicación <input type="date" name="fecha_publicacion" required></label>
      <label>Precio (COP) <input type="number" name="precio" step="0.01" min="0" required></label>
      <label class="check"><input type="checkbox" name="disponible" checked> Disponible</label>
      <label>Descripción <textarea name="descripcion" rows="3"></textarea></label>
      <button>Guardar libro</button>
    </form>`));
});

app.post('/libros', async (req, res) => {
  const { titulo, id_autor, fecha_publicacion, precio, descripcion } = req.body;
  const disponible = req.body.disponible ? 1 : 0;
  await pool.query(
    'INSERT INTO libros (titulo, id_autor, fecha_publicacion, precio, disponible, descripcion) VALUES (?,?,?,?,?,?)',
    [titulo, id_autor, fecha_publicacion, precio, disponible, descripcion || null]);
  res.redirect('/?ok=1');
});

// ---- Enlace 2: muestra lo que hay en la base de datos ----
app.get('/libros', async (req, res) => {
  const [rows] = await pool.query(`SELECT l.*, a.nombre AS autor FROM libros l
    JOIN autores a ON a.id_autor = l.id_autor ORDER BY l.id_libro`);
  const filas = rows.map(l => `<tr><td>${l.id_libro}</td><td>${esc(l.titulo)}</td><td>${esc(l.autor)}</td>
    <td>${fecha(l.fecha_publicacion)}</td><td>$ ${Number(l.precio).toLocaleString('es-CO')}</td>
    <td>${l.disponible ? 'Sí' : 'No'}</td><td>${esc(l.descripcion)}</td></tr>`).join('');
  res.send(layout('Libros', `<h2>Libros en la base de datos (${rows.length})</h2>
    <div class="scroll"><table><thead><tr><th>ID</th><th>Título</th><th>Autor</th><th>Publicación</th>
    <th>Precio</th><th>Disponible</th><th>Descripción</th></tr></thead><tbody>${filas || '<tr><td colspan="7">Sin datos</td></tr>'}</tbody></table></div>`));
});

app.get('/autores', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM autores ORDER BY id_autor');
  const filas = rows.map(a => `<tr><td>${a.id_autor}</td><td>${esc(a.nombre)}</td><td>${esc(a.pais)}</td>
    <td>${fecha(a.fecha_nacimiento)}</td><td>${a.premiado ? 'Sí' : 'No'}</td><td>${esc(a.biografia)}</td>
    <td>${new Date(a.fecha_registro).toLocaleString('es-CO')}</td></tr>`).join('');
  res.send(layout('Autores', `<h2>Autores (${rows.length})</h2><div class="scroll"><table><thead><tr><th>ID</th><th>Nombre</th>
    <th>País</th><th>Nacimiento</th><th>Premiado</th><th>Biografía</th><th>Registro</th></tr></thead><tbody>${filas}</tbody></table></div>`));
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 3000;
async function start() {
  for (let i = 0; i < 30; i++) {            // espera a que MySQL esté listo
    try { await pool.query('SELECT 1'); break; } catch { await new Promise(r => setTimeout(r, 2000)); }
  }
  app.listen(port, () => console.log(`Servidor listo en http://localhost:${port}`));
}
start();
