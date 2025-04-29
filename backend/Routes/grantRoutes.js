import express from 'express';
import { fetchAllGrants, fetchWhoCanApplyAndScope } from '../Controllers/grantController.js';
import { getAllGrants, getGrantsByIds, searchGrants, filterGrants } from '../Controllers/grantsControllers.js';
import { recommendRoutes } from '../Controllers/recommendations//recommend-grants.js';

const router = express();


router.get('/',getAllGrants)
router.post('/by-ids',getGrantsByIds)
router.get('/search',searchGrants)
router.get('/filter',filterGrants)
router.post('/recommended-grants', recommendRoutes)

export default router;