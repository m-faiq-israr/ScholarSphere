import express from 'express';
import { fetchAllGrants } from '../Controllers/grantController.js';
const router = express();

router.get('/',fetchAllGrants)

export default router;