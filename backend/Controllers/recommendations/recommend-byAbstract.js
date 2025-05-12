import axios from 'axios';
import { Journals } from '../../Models/JournalModels/SJRModel.js'; 


const recommendJournalsByAbstract = async (req, res) => {
  const { abstract } = req.body;

  if (!abstract || typeof abstract !== 'string' || !abstract.trim()) {
    return res.status(400).json({ message: 'Abstract is required.' });
  }

  try {
    const journalsFromDB = await Journals.find();

    const formattedJournals = journalsFromDB.map(j => ({
      title: j.title || '',
      subject_areas: Array.isArray(j.subject_areas) ? j.subject_areas : [],
      scope: j.scope || '',
      publisher: j.publisher || '',
      country_flag: j.country_flag || '',
      coverage: j.coverage || '',
      homepage: j.homepage || '',
      publish_guide: j.publish_guide || '',
      contact_email: j.contact_email || '',
      link: j.link || ''
    }));

    const response = await axios.post('https://python-recommender-production-53bf.up.railway.app/recommend/journals/by-abstract', {
      abstract,
      journals: formattedJournals
    });

    res.json(response.data);
  } catch (err) {
    console.error('Journal abstract recommendation error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export {recommendJournalsByAbstract};