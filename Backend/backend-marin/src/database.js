import pg from 'pg';

export const pool = new pg.Pool({
    user: "DB_USER",
    host: 'DB_HOST',
    password: 'DB_PASSWORD',
    database: 'DB_NAME',
    port: "DB_PORT",
})

