import express from 'express';
import cors from 'cors'; 
import axios from 'axios';

import conferenceRoutes from './Routes/conferenceRoutes.js';
import grantRoutes from './Routes/grantRoutes.js';
import journalRoutes from './Routes/journalRoutes.js';
import publicationsRoutes from './Routes/publicationsRoutes.js'
import saveItemRoutes from './Routes/saveItemRoutes.js'
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json()); 

app.use('/api/conferences', conferenceRoutes);
app.use('/api/grants', grantRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/publications', publicationsRoutes);
app.use('/api/items', saveItemRoutes);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
