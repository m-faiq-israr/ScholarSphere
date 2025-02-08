import { SJRJournals } from "../Models/JournalModels/SJRModel.js";

const fetchAllJournals = async (req, res) => {
    try {
      const sjrData = await SJRJournals.find({});
      res.status(200).json(sjrData);
    } catch (error) {
      console.error('Error fetching SJR Journals data:', error);
      throw error; 
    }
  };

export {fetchAllJournals}