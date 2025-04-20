import express from 'express';
import axios from 'axios';
import { admin, db } from '../firebase.js';

// ✅ Import all four conference models
import { ConferenceService } from '../Models/ConferenceModels/conference_serviceModel.js';
import { Conference365 } from '../Models/ConferenceModels/conference365Model.js';
import { ConferenceLists } from '../Models/ConferenceModels/conferenceListsModel.js';
import { WasetConference } from '../Models/ConferenceModels/wasetConferenceModel.js';

const router = express.Router();

const recommendConferences = async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // ✅ 1. Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // ✅ 2. Get user interests and publications from Firestore
    const userDoc = await db.collection('user_profile').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const userData = userDoc.data();
    const interests = userData.fieldsofInterest || [];
    const publications = (userData.publications || []).map(pub => ({
      title: pub.title || '',
      journal: pub.journal || '',
      year: pub.year || '',
      authors: pub.authors || [],
      keywords: pub.keywords || [],
      abstract: pub.abstract || ''
    }));

    if (!interests.length) {
      return res.status(400).json({ message: 'No interests found in user profile' });
    }

    // ✅ 3. Fetch conferences from 4 MongoDB models
    const [conf1, conf2, conf3, conf4] = await Promise.all([
      ConferenceService.find(),
      Conference365.find(),
      ConferenceLists.find(),
      WasetConference.find(),
    ]);

    const allConferences = [...conf1, ...conf2, ...conf3, ...conf4];

    // ✅ 4. Format data for the recommender
    const formattedConferences = allConferences.map(c => ({
      title: c.title || '',
      location: c.location || '',
      link: c.link || '',
      date: c.date || c.dates || ''
    }));

    // ✅ 5. Send to Python recommender
    const response = await axios.post('http://127.0.0.1:8000/recommend/conferences', {
      user_interests: interests,
      publications,
      conferences: formattedConferences
    });

    // ✅ 6. Return recommendations to frontend
    res.json(response.data);

  } catch (err) {
    console.error('Conference recommendation error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export { recommendConferences };
