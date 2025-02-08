import express from 'express';
import { fetchAllJournals } from '../Controllers/journalController.js';
const router = express();

router.get('/',fetchAllJournals)

export default router;