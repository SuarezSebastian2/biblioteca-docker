-- Script de base de datos: Biblioteca (MySQL 8)
-- Se ejecuta automáticamente al crear el contenedor por primera vez.
CREATE DATABASE IF NOT EXISTS biblioteca CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE biblioteca;

-- Tabla 1: autores (7 columnas)
CREATE TABLE IF NOT EXISTS autores (
  id_autor        INT AUTO_INCREMENT PRIMARY KEY,            -- entero
  nombre          VARCHAR(100) NOT NULL,                     -- carácter
  pais            VARCHAR(60)  NOT NULL,                     -- carácter
  fecha_nacimiento DATE        NOT NULL,                     -- fecha
  premiado        BOOLEAN      NOT NULL DEFAULT FALSE,       -- booleano
  biografia       TEXT,                                      -- texto largo
  fecha_registro  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP -- fecha y hora
) ENGINE=InnoDB;

-- Tabla 2: libros (7 columnas) - depende de autores (llave foránea)
CREATE TABLE IF NOT EXISTS libros (
  id_libro        INT AUTO_INCREMENT PRIMARY KEY,            -- entero
  titulo          VARCHAR(150) NOT NULL,                     -- carácter
  id_autor        INT NOT NULL,                              -- entero (FK)
  fecha_publicacion DATE       NOT NULL,                     -- fecha
  precio          DECIMAL(10,2) NOT NULL,                    -- decimal
  disponible      BOOLEAN      NOT NULL DEFAULT TRUE,        -- booleano
  descripcion     TEXT,                                      -- texto largo
  CONSTRAINT fk_libros_autores FOREIGN KEY (id_autor)
    REFERENCES autores(id_autor) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

-- Autores base para que el formulario de libros tenga a quién referenciar
INSERT INTO autores (nombre, pais, fecha_nacimiento, premiado, biografia) VALUES
('Gabriel García Márquez','Colombia','1927-03-06',TRUE,'Premio Nobel de Literatura 1982.'),
('Isabel Allende','Chile','1942-08-02',TRUE,'Novelista chilena, autora de La casa de los espíritus.'),
('Jorge Luis Borges','Argentina','1899-08-24',TRUE,'Escritor de cuentos, ensayos y poesía.'),
('Julio Cortázar','Argentina','1914-08-26',FALSE,'Autor de Rayuela.'),
('Laura Restrepo','Colombia','1950-12-29',TRUE,'Novelista y periodista colombiana.');
