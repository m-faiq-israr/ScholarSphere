import express from 'express';
import {getAllConferences, searchConferencesByTitle, getConferencesByIds, filterConferences} from '../Controllers/conferencesController.js'
import { recommendConferences } from '../Controllers/recommendations/recommend-conferences.js';
const router = express();

router.get('/',getAllConferences)
router.get('/search',searchConferencesByTitle)
router.get('/filter',filterConferences)
router.post('/by-ids',getConferencesByIds)
router.post('/recommended-conferences', recommendConferences)

export default router;