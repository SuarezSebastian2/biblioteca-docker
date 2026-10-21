-- OPCIONAL: carga rápida de 15 libros (equivale a ingresarlos por el formulario)
USE biblioteca;
INSERT INTO libros (titulo, id_autor, fecha_publicacion, precio, disponible, descripcion) VALUES
('Cien años de soledad',1,'1967-05-30',65000,TRUE,'Saga de la familia Buendía en Macondo.'),
('El amor en los tiempos del cólera',1,'1985-12-05',58000,TRUE,'Historia de amor que dura más de cincuenta años.'),
('Crónica de una muerte anunciada',1,'1981-04-01',42000,FALSE,'Novela corta sobre un crimen anunciado.'),
('La casa de los espíritus',2,'1982-01-01',55000,TRUE,'Tres generaciones de la familia Trueba.'),
('Eva Luna',2,'1987-01-01',48000,TRUE,'Una narradora de historias en Latinoamérica.'),
('Paula',2,'1994-01-01',46000,TRUE,'Memoria escrita para su hija.'),
('Ficciones',3,'1944-01-01',39000,TRUE,'Colección de cuentos fantásticos.'),
('El Aleph',3,'1949-01-01',41000,TRUE,'Cuentos sobre el infinito y el tiempo.'),
('Rayuela',4,'1963-06-28',60000,TRUE,'Novela que puede leerse en varios órdenes.'),
('Bestiario',4,'1951-01-01',36000,FALSE,'Primer libro de cuentos de Cortázar.'),
('Final del juego',4,'1956-01-01',37000,TRUE,'Cuentos de Julio Cortázar.'),
('Delirio',5,'2004-01-01',52000,TRUE,'Premio Alfaguara de Novela 2004.'),
('La novia oscura',5,'1999-01-01',47000,TRUE,'Novela ambientada en Tora, Santander.'),
('Leopardo al sol',5,'1993-01-01',44000,TRUE,'Novela sobre guerra entre clanes familiares.'),
('Hot Sur',5,'2012-01-01',45000,FALSE,'Novela sobre migrantes latinos en Estados Unidos.');
