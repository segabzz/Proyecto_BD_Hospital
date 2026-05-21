import {Router} from 'express';

import {
    createByID,
    deleteByID,
    getAllTable,
    updateByID
} from "../controller/hospital.controller.js";
import {getCaso1, getCaso2, getCaso3, getCaso4} from "./UseCases.routes.js";

const router = Router();

router.get('/api/data/:tableName', getAllTable);

router.post('/api/data/:tableName', createByID);

router.put('/api/data/:tableName/:id', updateByID);

router.delete('/api/data/:tableName/:id', deleteByID);

//UseCases
router.get('/api/caso1', getCaso1);

router.get('/api/caso2', getCaso2);

router.get('/api/caso3', getCaso3);

router.get('/api/caso4', getCaso4);

export default router;