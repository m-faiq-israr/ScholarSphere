import express from 'express';
import { fetchAllConferences, getConferencesByIds } from '../Controllers/conferenceController.js';
import { recommendConferences } from '../Controllers/recommendations/recommend-conferences.js';
const router = express();

router.get('/',fetchAllConferences)
router.post('/by-ids',getConferencesByIds)
router.post('/recommended-conferences', recommendConferences)

export default router;