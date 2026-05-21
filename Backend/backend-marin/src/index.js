import express from 'express';
import cors from "cors";
import { PORT } from './config.js';
import userRoute from './routes/hospital.routes.js';

const app = express();

app.use(cors());    
app.use(express.json());
app.use(userRoute);

app.listen(PORT);

console.log(`server started on port ${PORT}`);