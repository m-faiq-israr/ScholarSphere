import express from 'express';
import { saveItem } from '../Controllers/SaveFeature/saveItem.js';
import { unsaveItem } from '../Controllers/SaveFeature/unsaveItem.js';

const router = express.Router();

router.post('/save-item', saveItem);
router.post('/unsave-item', unsaveItem);
router.get('/test', (req, res) => {
    res.send("Save item routes are working");
  });
  


export default router;
