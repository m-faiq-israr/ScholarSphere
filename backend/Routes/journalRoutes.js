import express from 'express';
import { fetchAllJournals } from '../Controllers/journalController.js';
import { recommendJournals } from '../Controllers/recommend-journals.js';
const router = express();

router.get('/',fetchAllJournals)
router.post('/recommended-journals', recommendJournals)

export default router;