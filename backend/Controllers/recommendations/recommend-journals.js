import express from 'express';
import axios from 'axios';
import { admin, db } from '../../firebase.js';
import { SJRJournals } from '../../Models/JournalModels/SJRModel.js'; 

const router = express.Router();

const recommendJournals = async (req, res) => {
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

    if (!interests.length) {
      return res.status(400).json({ message: 'No interests found in user profile' });
    }

    const journalsFromDB = await SJRJournals.find();
    const formattedJournals = journalsFromDB.map(j => ({
      title: j.title || '',
      subject_areas: Array.isArray(j.subject_areas) ? j.subject_areas.join(', ') : j.subject_areas || '',
      country_flag: j.country_flag || '',
      publisher: j.publisher || '',
      coverage: j.coverage || '',
      homepage: j.homepage || '',
      publish_guide: j.publish_guide || '',
      contact_email: j.contact_email || '',
      link: j.link || ''
    }));

    const response = await axios.post('http://127.0.0.1:8000/recommend/journals', {
      user_interests: interests,
      publications,
      fetched_publications: fetchedPublications,
      journals: formattedJournals
    });

    res.json(response.data);

  } catch (err) {
    console.error('Journal recommendation error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};


export { recommendJournals };
