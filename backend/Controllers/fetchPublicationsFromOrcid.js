import axios from 'axios';
import { db } from '../firebase.js';

const fetchPublicationsFromOrcid = async (req, res) => {
  try {
    const { uid } = req.body;
    if (!uid) {
      return res.status(400).json({ message: 'UID is required.' });
    }

    const userDoc = await db.collection('user_profile').doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    const userData = userDoc.data();
    const orcidId = userData.orcidId;

    if (!orcidId || !orcidId.trim()) {
      return res.status(200).json({ message: 'No ORCID ID provided, skipping fetch.', publications: [] });
    }

    const response = await axios.get(`https://api.openalex.org/works`, {
      params: {
        'filter': `author.orcid:${orcidId}`, 
        'per_page': 50  
      },
      headers: {
        "User-Agent": "scholarsphere-app (scholarspherefyp@gmail.com)"
      }
    });

    console.log("OpenAlex raw response:", response.data);

    const publications = response.data.results.map(pub => ({
      title: pub.title || '',
      journal: pub.primary_location?.source?.display_name || 'Unknown Journal',
      year: pub.publication_year?.toString() || '',
      authors: pub.authorships?.map(a => a.author.display_name) || [],
      keywords: pub.concepts?.slice(0, 3).map(c => c.display_name) || ["", "", ""],
      abstract: pub.abstract_inverted_index 
        ? Object.keys(pub.abstract_inverted_index).join(' ') 
        : "",
    }));

    await db.collection('user_profile').doc(uid).update({
      fetched_publications: publications
    });

    res.json({ message: "Fetched publications updated successfully.", publications });
    
  } catch (err) {
    console.error("Error fetching publications:", err.response?.data || err.message || err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

export { fetchPublicationsFromOrcid };
