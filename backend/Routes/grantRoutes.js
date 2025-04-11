import express from 'express';
import { fetchAllGrants, fetchWhoCanApplyAndScope } from '../Controllers/grantController.js';
import { getAllGrants, searchGrants, filterGrants } from '../Controllers/grantsControllers.js';
import { recommendRoutes } from '../Controllers/recommend-grants.js';

const router = express();

// router.get('/',fetchAllGrants)
// router.get('/details',fetchWhoCanApplyAndScope)

router.get('/',getAllGrants)
router.get('/search',searchGrants)
router.get('/filter',filterGrants)
router.post('/recommended-grants', recommendRoutes)

export default router;