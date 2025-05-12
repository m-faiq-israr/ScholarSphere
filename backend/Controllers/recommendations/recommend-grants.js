import express from 'express';
import axios from 'axios';
import { admin, db } from '../../firebase.js';
import {Grants} from '../../Models/GrantsModels/grantsModel.js'

const router = express.Router();

const recommendRoutes = async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    const userDoc = await db.collection('user_profile').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const userData = userDoc.data();
    const interests = userData.fieldsofInterest || [];
    const publications = userData.publications || [];
    const fetchedPublications = userData.fetched_publications || [];
    const educationLevel = userData.educationLevel || "";
const affiliation = userData.currentAffiliation || ""; 


    if (!interests.length) {
      return res.status(400).json({ message: 'No interests found in user profile' });
    }

    const grantsFromDB = await Grants.find();
    const formattedGrants = grantsFromDB.map(g => ({
      title: g.title || '',
      description: g.description || '',
      scope: g.scope || '',
      opening_date: g.opening_date || '',
      closing_date: g.closing_date || '',
      who_can_apply: g.who_can_apply || '',
      link: g.link || '',
      total_fund : g.total_fund || '',
      contact_email: g.contact_email || '',
      opportunity_status: g.opportunity_status || ''

    }));

    const response = await axios.post('https://python-recommender-production-53bf.up.railway.app/recommend/grants', {
      user_interests: interests,
      publications,
      educationLevel,
      currentAffiliation: affiliation,
      fetched_publications: fetchedPublications,
      grants: formattedGrants
    });

    res.json(response.data);
  } catch (err) {
    console.error('Recommendation error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export { recommendRoutes };
