import express from 'express';
import { fetchAllJournals, getJournalsByIds, searchJournalsByTitle, filterJournals  } from '../Controllers/journalController.js';
import { recommendJournals } from '../Controllers/recommendations/recommend-journals.js';
import {recommendJournalsByAbstract} from '../Controllers/recommendations/recommend-byAbstract.js'
const router = express();

router.get('/',fetchAllJournals)
router.get('/search',searchJournalsByTitle)
router.get('/filter',filterJournals)
router.post('/by-ids',getJournalsByIds)
router.post('/recommended-journals', recommendJournals)
router.post('/recommend-by-abstract', recommendJournalsByAbstract);


export default router;