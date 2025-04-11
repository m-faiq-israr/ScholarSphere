import express from 'express';
import axios from 'axios';
import { admin, db } from '../firebase.js';
import { SJRJournals } from '../Models/JournalModels/SJRModel.js'; 

const router = express.Router();

const recommendJournals = async (req, res) => {
  const idToken = req.headers.authorization?.split('Bearer ')[1];
  if (!idToken) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // 1. Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // 2. Fetch interests from Firestore
    const userDoc = await db.collection('user_profile').doc(userId).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    const interests = userDoc.data().fieldsofInterest || [];
    if (!interests.length) {
      return res.status(400).json({ message: 'No interests found in user profile' });
    }

    // 3. Fetch journals from MongoDB
    const journalsFromDB = await SJRJournals.find();

    // 4. Format all journal fields
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

    // 5. Send to recommender
    const response = await axios.post('http://127.0.0.1:8000/recommend/journals', {
      user_interests: interests,
      journals: formattedJournals
    });

    res.json(response.data);

  } catch (err) {
    console.error('Journal recommendation error:', err.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export { recommendJournals };
