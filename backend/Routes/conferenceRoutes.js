import express from 'express';
import { fetchAllConferences } from '../Controllers/conferenceController.js';

const router = express();

router.get('/',fetchAllConferences)

export default router;