# 🏥 Dashboard Administrativo Hospitalario

Sistema web full-stack para la gestión y análisis de información hospitalaria. Proyecto integrador de la materia *Administración de Bases de Datos Corporativas*.

## Arquitectura

```
┌──────────────────────────────────────────────────┐
│                   Frontend                        │
│            React + Tailwind CSS                   │
│         http://localhost:3000                     │
└────────────────────┬─────────────────────────────┘
                     │ HTTP/REST
┌────────────────────▼─────────────────────────────┐
│                   Backend                         │
│           Express.js + Node.js                    │
│         http://localhost:4000                     │
└────────────────────┬─────────────────────────────┘
                     │ SQL
┌────────────────────▼─────────────────────────────┐
│             PostgreSQL                            │
│           Base de datos hospitalaria              │
└──────────────────────────────────────────────────┘
```

## Tech Stack

| Capa       | Tecnologías                                      |
|------------|--------------------------------------------------|
| Frontend   | React 19, React Router 7, Tailwind CSS 3, Lucide React |
| Backend    | Node.js, Express 5, CORS, Morgan                 |
| Base de datos | PostgreSQL, pg (node-postgres)               |
| Data Mining | Algoritmo Apriori (implementación propia)       |

## Estructura del Proyecto

```
Documentación_Equipo_1/
├── Backend/
│   └── backend-marin/          # API REST
│       └── src/
│           ├── controller/      # Lógica de negocio
│           ├── routes/          # Definición de rutas
│           ├── config.js        # Puerto del servidor
│           ├── database.js      # Conexión a PostgreSQL
│           └── index.js         # Punto de entrada
├── Frontend/
│   └── React_Marin/            # Dashboard React
│       └── src/
│           ├── Components/      # Componentes reutilizables
│           ├── Layout/          # Sidebar y Topbar
│           ├── pages/           # Vistas principales
│           │   ├── DatabaseTables/  # CRUD de tablas
│           │   └── UseCases/        # Casos de uso
│           └── docs/            # Documentación PDF
└── Base de datos/
    └── *.sql                   # Dump de la base de datos
```

## API Endpoints

### CRUD Dinámico
| Método | Ruta                          | Descripción               |
|--------|-------------------------------|---------------------------|
| GET    | `/api/data/:tableName`        | Obtener todos los registros |
| POST   | `/api/data/:tableName`        | Crear un registro         |
| PUT    | `/api/data/:tableName/:id`    | Actualizar un registro    |
| DELETE | `/api/data/:tableName/:id`    | Eliminar un registro      |

### Casos de Uso (Data Mining con Apriori)
| Ruta             | Descripción                                      |
|------------------|--------------------------------------------------|
| `/api/caso1`     | Compatibilidad sanguínea vs enfermedades         |
| `/api/caso2`     | Áreas hospitalarias vs nivel de urgencia         |
| `/api/caso3`     | Temporada vs enfermedades vs origen de brote     |
| `/api/caso4`     | Medicamentos y tratamientos por paciente         |

## Requisitos Previos

- Node.js >= 18
- npm
- PostgreSQL

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/segabzz/Proyecto_BD_Hospital.git
cd Proyecto_BD_Hospital
```

### 2. Base de datos

Restaurar el dump incluido:

```bash
psql -U <usuario> -d <base_de_datos> -f "Base de datos/postgres_localhost-2026_05_21_01_59_53-dump.sql"
```

### 3. Backend

```bash
cd Backend/backend-marin
npm install
```

Configurar la conexión a la base de datos editando `src/database.js`:

```js
export const pool = new pg.Pool({
    user: "tu_usuario",
    host: "localhost",
    password: "tu_contraseña",
    database: "nombre_bd",
    port: 5432,
})
```

Iniciar el servidor:

```bash
npm run dev
```

### 4. Frontend

```bash
cd Frontend/React_Marin
npm install
npm start
```

La aplicación estará disponible en `http://localhost:3000` y el backend en `http://localhost:4000`.

## Rutas del Frontend

| Ruta                    | Descripción                     |
|-------------------------|----------------------------------|
| `/`                     | Pantalla de inicio              |
| `/database`             | Explorar tablas de la BD        |
| `/database/:tableName`  | CRUD de una tabla específica    |
| `/casos_de_uso`         | Resultados de casos de uso      |
| `/documentacion`        | Visor de documentos PDF         |

## Documentación Incluida

Los siguientes documentos en PDF están disponibles en `Frontend/React_Marin/src/docs/` y accesibles desde la sección *Documentación* de la aplicación:

- Marco Teórico
- Informe Técnico
- Desarrollo de la Base de Datos
- Llenado de la Base de Datos
- Diagrama UML

## Licencia

Este proyecto es de uso académico.
