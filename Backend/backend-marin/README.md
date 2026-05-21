# Backend de dashboard administrativo hospitalario

Este proyecto fue creado en el entorno de WebStorm IDE, se conecta a la base de 
datos hecha en PostgresSQL y recibe las llamadas desde el frontend donde administra, 
consulta y retorna los datos al frontend.

## Funcionalidad

- Se conecta a la base de datos local.
- Realiza consultas SQL, y después lo transforma en JSON para enviar al front.
- Maneja rutas que envia a dos secciones del frontend; La base de datos y casos de uso.

## Tecnologias

- Node.Js
- Express
- RestAPI
- Cors
- PostgreSQL

## Requisitos

Antes de ejecutar, tener instalado:

- Node.js
- npm

## Instalación

Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd backend_marin
```

Instala las dependencias:

```bash
npm install
```

Inicia la aplicacion en modo desarrollo:

```bash
npm run dev
```

## Configuración

Al momento de clonar el repositorio, se debe de remplazar por las llaves
de acceso propias de su base de datos en el archivo database.js 

```Text
export const pool = new pg.Pool({
    user: "DB_USER",
    host: 'DB_HOST',
    password: 'DB_PASSWORD',
    database: 'DB_NAME',
    port: "DB_PORT",
})
```

## Estructura del proyecto

```text
/backend-marin
    /.idea
    /node_modules
    /src
        /controller
            /hospital.controller.js
            /UseCases.utils.js
        /routes
            hospital.routes.js
            UseCases.routes.js
        /config.js
        /database.js
        /index.js
    /package.json
    /package-lock.json
    /README.md
```
