import { Conferences } from '../Models/ConferenceModels/conferenceModel.js';
import mongoose from 'mongoose';
const getAllConferences = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {
        start_date: { $ne: null }
      };

    const total = await Conferences.countDocuments(filter);

    const conferences = await Conferences.find(filter)
      .sort({ start_date: 1 }) 
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({ conferences, total, page, limit });
  } catch (error) {
    console.error("Error fetching conferences:", error);
    res.status(500).json({ message: "Error fetching conferences data." });
  }
};

const searchConferencesByTitle = async (req, res) => {
    try {
      const query = req.query.q || '';
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const filter = {
        title: { $regex: query, $options: 'i' }, 
        link: { $exists: true, $ne: null },
        start_date: { $ne: null }
      };
  
      const total = await Conferences.countDocuments(filter);
  
      const conferences = await Conferences.find(filter)
        .sort({ start_date: 1 })
        .skip(skip)
        .limit(limit)
        .lean();
  
      res.status(200).json({ conferences, total, page, limit });
    } catch (error) {
      console.error("Error searching conferences:", error);
      res.status(500).json({ message: "Error searching conferences." });
    }
  };


  const getConferencesByIds = async (req, res) => {
    try {
      const { ids } = req.body;
  
      if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: "Invalid or missing ids array." });
      }
  
      // Filter only valid ObjectIds
      const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
  
      if (validIds.length === 0) {
        return res.status(400).json({ message: "No valid ObjectIds provided." });
      }
  
      const conferences = await Conferences.find({ _id: { $in: validIds } }).lean();
  
      res.status(200).json({ conferences });
    } catch (error) {
      console.error("Error fetching conferences by IDs:", error);
      res.status(500).json({ message: "Server error fetching conferences." });
    }
  };
  
  const filterConferences = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const { startDate, endDate, location } = req.query;
  
      const allConferences = await Conferences.find({
        start_date: { $ne: null }
      }).lean();
  
      const parsedStart = startDate ? new Date(startDate) : null;
      const parsedEnd = endDate ? new Date(endDate) : null;
  
      let filtered = allConferences;
  
      if (parsedStart && parsedEnd) {
        filtered = filtered.filter(conf => {
          const confDate = new Date(conf.start_date);
          return confDate >= parsedStart && confDate <= parsedEnd;
        });
      }
  
      if (location) {
        filtered = filtered.filter(conf =>
          conf.location?.toLowerCase().includes(location.toLowerCase())
        );
      }
  
      const total = filtered.length;
      const paginated = filtered.slice(skip, skip + limit);
  
      res.status(200).json({ conferences: paginated, total, page, limit });
    } catch (error) {
      console.error("Error filtering conferences:", error);
      res.status(500).json({ message: "Error filtering conferences data." });
    }
  };
  

export { getAllConferences, searchConferencesByTitle, getConferencesByIds, filterConferences };
