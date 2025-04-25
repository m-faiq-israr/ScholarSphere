// routes/fetchPublicationsRoute.js
import express from 'express';
import { fetchPublicationsFromOrcid } from '../Controllers/fetchPublicationsFromOrcid.js';

const router = express.Router();

// Route to fetch publications using ORCID ID
router.post('/fetch-publications', fetchPublicationsFromOrcid);

export default router;
