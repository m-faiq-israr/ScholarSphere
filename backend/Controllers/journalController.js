import { Journals } from "../Models/JournalModels/SJRModel.js";
import mongoose from 'mongoose';

const fetchAllJournals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalJournals = await Journals.countDocuments();
    const journals = await Journals.find().skip(skip).limit(limit);

    res.status(200).json({
      journals,
      total: totalJournals,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching journals:', error);
    res.status(500).json({ message: 'Error fetching journals.' });
  }
};

const searchJournalsByTitle = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || '';

    const filter = searchQuery
      ? { title: { $regex: searchQuery, $options: 'i' } }
      : {};

    const total = await Journals.countDocuments(filter);
    const journals = await Journals.find(filter).skip(skip).limit(limit);

    res.status(200).json({
      journals,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error searching journals:', error);
    res.status(500).json({ message: 'Error searching journals.' });
  }
};

const filterJournals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { country = '', publisher = '', subject_area = '' } = req.query;

    const filter = {};

    if (country) {
      filter.country = { $regex: country, $options: 'i' };
    }

    if (publisher) {
      filter.publisher = { $regex: publisher, $options: 'i' };
    }

    if (subject_area) {
      filter.subject_areas = { $regex: subject_area, $options: 'i' };
    }

    const total = await Journals.countDocuments(filter);
    const journals = await Journals.find(filter).skip(skip).limit(limit);

    res.status(200).json({
      journals,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error filtering journals:', error);
    res.status(500).json({ message: 'Error filtering journals.' });
  }
};


const getJournalsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: 'Invalid or missing IDs array.' });
    }

    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));
    if (validIds.length === 0) {
      return res.status(400).json({ message: 'No valid ObjectIDs provided.' });
    }

    const objectIds = validIds.map(id => new mongoose.Types.ObjectId(id));
    const journals = await Journals.find({ _id: { $in: objectIds } });

    res.status(200).json({
      journals,
      total: journals.length,
    });
  } catch (error) {
    console.error('Error fetching journals by IDs:', error);
    res.status(500).json({ message: 'Error fetching journals by IDs.' });
  }
};

export { fetchAllJournals, getJournalsByIds, searchJournalsByTitle, filterJournals };