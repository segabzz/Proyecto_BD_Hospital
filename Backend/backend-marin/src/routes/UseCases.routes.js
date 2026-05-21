import { pool } from '../database.js'; // Asegúrate de importar tu conexión
import generarReglasApriori from "../controller/UseCases.Utils.js";

export const getCaso1 = async (req, res) => {
    try {

        const sql_donante = "SELECT p.pacienteid, 'Donante_' || ts.grupo AS tipo_donante FROM pacientes p JOIN tiposanguineos ts ON ts.tiposanguineoid = p.tiposanguineoid";
        const sql_receptor = "SELECT p.pacienteid, 'Receptor_' || tr.grupo AS tipo_receptor FROM pacientes p JOIN tiposanguineos ts ON ts.tiposanguineoid = p.tiposanguineoid JOIN compatibilidadsanguinea cs ON cs.donanteid = ts.tiposanguineoid JOIN tiposanguineos tr ON tr.tiposanguineoid = cs.receptorid";
        const sql_enf = "SELECT p.pacienteid, 'Enf_' || ce.nombre AS enfermedad FROM pacientes p JOIN citas ci ON ci.pacienteid = p.pacienteid JOIN consultas co ON co.citaid = ci.citaid JOIN catalogoenfermedades ce ON ce.enfermedadid = co.enfermedadid WHERE ci.estado = 'Completada'";

        const [donantesRes, receptoresRes, enfRes] = await Promise.all([
            pool.query(sql_donante),
            pool.query(sql_receptor),
            pool.query(sql_enf)
        ]);

        const transDict = {};

        const agrupar = (rows, columna_valor) => {
            rows.forEach(row => {
                if (!transDict[row.pacienteid]) transDict[row.pacienteid] = new Set();
                transDict[row.pacienteid].add(row[columna_valor]);
            });
        };

        agrupar(donantesRes.rows, 'tipo_donante');
        agrupar(receptoresRes.rows, 'tipo_receptor');

        enfRes.rows.forEach(row => {
            if (transDict[row.pacienteid]) {
                transDict[row.pacienteid].add(row.enfermedad);
            }
        });

        const transacciones = Object.values(transDict)
            .map(set => Array.from(set))
            .filter(arr => arr.length >= 3);

        const tablasInvolucradas = ["Pacientes", "TiposSanguineos", "CompatibilidadSanguinea", "CatalogoEnfermedades"];

        if (transacciones.length === 0) {
            return res.json({ items: [], tablas: tablasInvolucradas, reglas: [] });
        }

        const itemsUnicos = [...new Set(transacciones.flat())].sort();

        const reglas = generarReglasApriori(transacciones, 0.05, 0.3, 1.0);

        res.json({
            items: itemsUnicos,
            tablas: tablasInvolucradas,
            reglas: reglas
        });

    } catch (err) {
        console.error("Error en Caso 1:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getCaso2  = async (req, res) => {
    try {

        const sql = "SELECT i.ingresoid, 'Area_' || a.nombre AS area, 'Urgencia_' || a.nivelurgencia AS nivel_urgencia, 'Estado_' || i.estado AS estado_ingreso FROM ingresoshospitalarios i JOIN areashospital a ON a.areaid = i.areaid";

        const { rows } = await pool.query(sql);

        const transacciones = rows.map(row => [
            row.area,
            row.nivel_urgencia,
            row.estado_ingreso
        ]);

        const tablasInvolucradas = ["IngresosHospitalarios", "AreasHospital"];

        if (transacciones.length === 0) {
            return res.json({ items: [], tablas: tablasInvolucradas, reglas: [] });
        }

        const itemsUnicos = [...new Set(transacciones.flat())].sort();

        const reglas = generarReglasApriori(transacciones, 0.05, 0.3, 1.0);

        // 5. Responder a React
        res.json({
            items: itemsUnicos,
            tablas: tablasInvolucradas,
            reglas: reglas
        });

    } catch (err) {
        console.error("Error en Caso 2:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getCaso3 = async (req, res) => {
    try {
        const sql = "SELECT co.consultaid, 'Temp_' || co.temporada AS temporada, 'Enf_' || ce.nombre AS enfermedad, 'Tipo_' || ce.origenbrote AS origen_brote FROM consultas co JOIN catalogoenfermedades ce ON ce.enfermedadid = co.enfermedadid WHERE ce.origenbrote <> 'Otra' AND ce.origenbrote IS NOT NULL";

        const { rows } = await pool.query(sql);

        const transacciones = rows.map(row => [
            row.temporada,
            row.enfermedad,
            row.origen_brote
        ]);

        const tablasInvolucradas = ["Consultas", "CatalogoEnfermedades"];

        if (transacciones.length === 0) {
            return res.json({ items: [], tablas: tablasInvolucradas, reglas: [] });
        }

        const itemsUnicos = [...new Set(transacciones.flat())].sort();

        const reglas = generarReglasApriori(transacciones, 0.05, 0.3, 1.0);

        res.json({
            items: itemsUnicos,
            tablas: tablasInvolucradas,
            reglas: reglas
        });

    } catch (err) {
        console.error("Error en Caso 3:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getCaso4 = async (req, res) => {
    try {
        const sql_meds = "SELECT p.pacienteid, 'Med_' || m.tipomedicamento AS tipo_med, 'CostoMed_' || m.umbralcosto AS costo_med FROM pacientes p JOIN citas ci ON ci.pacienteid = p.pacienteid JOIN consultas co ON co.citaid = ci.citaid JOIN recetas r ON r.consultaid = co.consultaid JOIN detallereceta dr ON dr.recetaid = r.recetaid JOIN medicinas m ON m.medicinaid = dr.medicinaid WHERE ci.estado = 'Completada'";
        const sql_tratos = "SELECT ht.pacienteid, 'Atencion_' || t.tipoatencion AS tipo_atencion, 'CostoTrat_' || t.umbralcosto AS costo_trat, 'Duracion_' || t.duracion AS duracion FROM historialtratamientos ht JOIN tratamientos t ON t.tratamientoid = ht.tratamientoid";

        const [medsRes, tratosRes] = await Promise.all([
            pool.query(sql_meds),
            pool.query(sql_tratos)
        ]);

        const transDict = {};

        medsRes.rows.forEach(row => {
            if (!transDict[row.pacienteid]) transDict[row.pacienteid] = new Set();
            transDict[row.pacienteid].add(row.tipo_med);
            transDict[row.pacienteid].add(row.costo_med);
        });

        tratosRes.rows.forEach(row => {
            if (!transDict[row.pacienteid]) transDict[row.pacienteid] = new Set();
            transDict[row.pacienteid].add(row.tipo_atencion);
            transDict[row.pacienteid].add(row.costo_trat);
            transDict[row.pacienteid].add(row.duracion);
        });

        const transacciones = Object.values(transDict)
            .map(set => Array.from(set))
            .filter(arr => arr.length >= 2);

        const tablasInvolucradas = ["Pacientes", "Medicinas", "Recetas", "Tratamientos", "HistorialTratamientos"];

        if (transacciones.length === 0) {
            return res.json({ items: [], tablas: tablasInvolucradas, reglas: [] });
        }

        const itemsUnicos = [...new Set(transacciones.flat())].sort();
        const reglas = generarReglasApriori(transacciones, 0.05, 0.3, 1.0);

        res.json({
            items: itemsUnicos,
            tablas: tablasInvolucradas,
            reglas: reglas
        });

    } catch (err) {
        console.error("Error crítico en Caso 4:", err);
        res.status(500).json({ error: err.message });
    }
};