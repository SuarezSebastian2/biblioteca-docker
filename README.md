
# Biblioteca – Aplicación contenerizada en Docker
Actividad Sumativa · Unidad 2 · Contenerización de Aplicaciones de Software

Aplicación web (Node.js + Express) que guarda y consulta datos en una base de datos relacional (MySQL 8).
Todo corre en contenedores Docker orquestados con Docker Compose.

## Estructura
---
```
biblioteca-docker/
├── docker-compose.yml        # Orquesta los 2 contenedores (web + db) y el volumen
├── db/
│   ├── init.sql              # SCRIPT DE BASE DE DATOS (2 tablas x 7 columnas, FK)
│   └── datos_15_libros.sql   # (opcional) carga rápida de 15 libros
└── app/
    ├── Dockerfile            # Imagen del servidor web (node:20-alpine)
    ├── package.json
    ├── server.js             # Código fuente del servidor
    └── public/estilos.css
```
---

## Modelo entidad-relación
`autores (1) ──< (N) libros`  (libros.id_autor → autores.id_autor)

| autores            | tipo          | libros              | tipo          |
|--------------------|---------------|---------------------|---------------|
| id_autor (PK)      | INT           | id_libro (PK)       | INT           |
| nombre             | VARCHAR(100)  | titulo              | VARCHAR(150)  |
| pais               | VARCHAR(60)   | id_autor (FK)       | INT           |
| fecha_nacimiento   | DATE          | fecha_publicacion   | DATE          |
| premiado           | BOOLEAN       | precio              | DECIMAL(10,2) |
| biografia          | TEXT          | disponible          | BOOLEAN       |
| fecha_registro     | TIMESTAMP     | descripcion         | TEXT          |

## Ejecución
---
```bash
docker compose up -d --build
```
---
- Formulario para ingresar datos: http://localhost:3000/
- Datos guardados en la BD (enlace distinto): http://localhost:3000/libros
- Autores: http://localhost:3000/autores

Los datos persisten en el volumen `db_data` (sobreviven a `docker compose down`; se borran solo con `down -v`).
Carga opcional de 15 libros:
`docker exec -i biblioteca-db mysql -ubiblio -pbiblio123 < db/datos_15_libros.sql`


**Parte 1 – Instalación y comandos básicos** 
---
```bash
docker --version                       #  1
docker version                         #  2
docker info                            #  3
docker help                            #  4
docker pull hello-world                #  5
docker run hello-world                 #  6
docker images                          #  7
docker image ls                        #  8
docker pull nginx:alpine               #  9
docker run -d --name prueba-nginx -p 8081:80 nginx:alpine   # 10
docker ps                              # 11
docker ps -a                           # 12
docker logs prueba-nginx               # 13
docker inspect prueba-nginx            # 14
docker stats --no-stream               # 15
docker top prueba-nginx                # 16
docker exec -it prueba-nginx sh        # 17  (escribir exit para salir)
docker stop prueba-nginx               # 18
docker start prueba-nginx              # 19
docker restart prueba-nginx            # 20
docker rm -f prueba-nginx              # 21  (elimina el contenedor)
docker rmi nginx:alpine                # 22  (elimina la imagen)
docker rmi hello-world                 # 23
docker image prune -f                  # 24
docker container prune -f              # 25
docker volume ls                       # 26
docker network ls                      # 27
docker system df                       # 28
```
---
**Parte 2 – La aplicación** 
---
```bash
docker build -t biblioteca-web:1.0 ./app    # 29  construir la imagen
docker compose up -d --build                # 30  levantar web + db
docker compose ps                           # 31
docker compose logs web                     # 32
docker exec -it biblioteca-db mysql -ubiblio -pbiblio123 biblioteca   # 33
#   SHOW TABLES;  DESCRIBE autores;  DESCRIBE libros;  SELECT COUNT(*) FROM libros;
docker volume inspect biblioteca-docker_db_data   # 34
docker compose restart                      # 35  (demuestra persistencia)
docker compose down                         # 36
docker compose up -d                        # 37  (los datos siguen ahí)
```
---
