import {pool} from '../database.js';

const tablesAllowed = {
    pacientes: 'pacienteid',
    personal: 'personalid'
};

//GET
export const getAllTable = async (req, res) => {
    const { tableName } = req.params;
    const nameLower = tableName.toLowerCase();

    if (!tablesAllowed[nameLower]) {
        return res.status(403).json({ error: "Acceso denegado o tabla no válida" });
    }

    const pkColumn = tablesAllowed[nameLower];

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    try {
        const dataQuery = `SELECT * FROM ${tableName} ORDER BY ${pkColumn} ASC LIMIT $1 OFFSET $2`;
        const result = await pool.query(dataQuery, [limit, offset]);

        const countQuery = `SELECT COUNT(*) FROM ${tableName}`;
        const countResult = await pool.query(countQuery);

        const totalRecords = parseInt(countResult.rows[0].count, 10) || 0;

        const totalPages = Math.ceil(totalRecords / limit) || 1;

        res.json({
            data: result.rows,
            currentPage: page,
            totalPages: totalPages,
            totalRecords: totalRecords
        });

    } catch (err) {
        console.error("Error en la consulta paginada:", err.message);
        res.status(500).send("Error en el servidor al paginar");
    }
}

//Post
export const createByID = async (req, res) => {
    const { tableName } = req.params;
    const nameLower = tableName.toLowerCase();

    // 1. CORRECCIÓN DE VALIDACIÓN: Usar el formato de diccionario
    if (!tablesAllowed[nameLower]) {
        console.error(`[POST] Intento de acceso no autorizado a la tabla: ${tableName}`);
        return res.status(403).json({ error: "Tabla no válida o no autorizada" });
    }

    try {
        console.log("PETICIÓN POST");
        console.log(`Tabla de destino: ${tableName}`);
        console.log("Datos recibidos en req.body:", req.body);

        const campos = Object.keys(req.body);
        const valores = Object.values(req.body);

        if (campos.length === 0) {
            console.warn("Advertencia: req.body llegó vacío.");
            return res.status(400).json({ error: "No se recibieron datos para insertar" });
        }

        // Construcción dinámica de la query SQL
        const placeholders = campos.map((_, i) => `$${i + 1}`).join(', ');
        const columnas = campos.join(', ');
        const query = `INSERT INTO ${tableName} (${columnas}) VALUES (${placeholders}) RETURNING *`;
        
        console.log("SQL Generada:", query);
        console.log("Valores a insertar:", valores);

        const result = await pool.query(query, valores);
        
        console.log("Registro guardado con éxito en la base de datos");
        
        
        res.status(201).json(result.rows);

    } catch (err) {
        
        console.error("Mensaje de error:", err.message);
        console.error("Causa probable:", err.detail || "Error de sintaxis o de servidor");
        
        res.status(500).json({ 
            error: "Error interno en el servidor", 
            detalle: err.message 
        });
    }
}

//Put
export const updateByID = async (req, res) => {
    const { tableName, id } = req.params; // El :id viene de la URL
    const nameLower = tableName.toLowerCase();

    if (!tablesAllowed[nameLower]) {
        return res.status(403).json({ error: "Tabla no válida" });
    }

    const pkColumn = tablesAllowed[nameLower];

    try {
        const campos = Object.keys(req.body);
        const valores = Object.values(req.body);

        if (campos.length === 0) {
            return res.status(400).json({ error: "No hay datos para actualizar" });
        }

        // Construimos el SET dinámico: "nombre = $1, edad = $2, ..."
        const setClause = campos.map((col, i) => `${col} = $${i + 1}`).join(', ');
        
        // Añadimos el ID al final del arreglo de valores para el WHERE
        valores.push(id);
        const idPos = valores.length; // La posición del ID será la última ($3, $4, etc.)

        const query = `UPDATE ${tableName} SET ${setClause} WHERE ${pkColumn} = $${idPos} RETURNING *`;
        
        const result = await pool.query(query, valores);
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al actualizar el registro");
    }
};

//Delete
export const deleteByID = async (req, res) => {
    const { tableName, id } = req.params;
    const nameLower = tableName.toLowerCase();

    if (!tablesAllowed[nameLower]) {
        return res.status(403).json({ error: "Tabla no válida" });
    }

    const pkColumn = tablesAllowed[nameLower];

    try {
        const query = `DELETE FROM ${tableName} WHERE ${pkColumn} = $1`;
        await pool.query(query, [id]);
        
        res.json({ message: "Registro eliminado correctamente" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al eliminar el registro");
    }
};

