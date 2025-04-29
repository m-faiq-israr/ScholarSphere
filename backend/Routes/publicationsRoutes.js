import express from 'express';
import { fetchPublicationsFromOrcid } from '../Controllers/fetchPublicationsFromOrcid.js';

const router = express.Router();

router.post('/fetch-publications', fetchPublicationsFromOrcid);

export default router;
