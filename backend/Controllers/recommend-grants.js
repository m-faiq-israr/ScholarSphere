import express from 'express';
import axios from 'axios';
import { admin, db } from '../firebase.js'; 
import { UkriGrants } from '../Models/GrantsModels/ukri.js'; 

const router = express.Router();


const recommendRoutes = async (req, res) =>{

    const idToken = req.headers.authorization?.split('Bearer ')[1];
    if (!idToken) return res.status(401).json({ message: 'Unauthorized' });
    
    try {
    // 1. Verify Firebase Auth Token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;
    
    // 2. Fetch user interests from Firestore's `user_profile` collection
    const userDoc = await db.collection('user_profile').doc(userId).get();
    if (!userDoc.exists) {
        return res.status(404).json({ message: 'User profile not found' });
    }
    
    const userData = userDoc.data();
    const interests = userData.fieldsofInterest || [];
    
    if (!interests.length) {
        return res.status(400).json({ message: 'No interests found in user profile' });
    }
    
    // 3. Fetch grants from MongoDB
    const grantsFromDB = await UkriGrants.find();
    
    // 4. Format grants for the recommender
    const formattedGrants = grantsFromDB.map(g => ({
        title: g.title || '',
        description: g.description || '',
        scope: g.scope || '',
        opening_date: g.opening_date || '',
        closing_date: g.closing_date || '',
        who_can_apply: g.who_can_apply || ''
      }));
      
    
    // 5. Send to Python FastAPI recommender
    const response = await axios.post('http://127.0.0.1:8000/recommend/grants', {
        user_interests: interests,
        grants: formattedGrants
    });
    
    // 6. Return recommendations to frontend
    res.json(response.data);
    
} catch (err) {
    console.error('Recommendation error:', err.message);
    res.status(500).json({ message: 'Server error' });
}
}

export {recommendRoutes}
