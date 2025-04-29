import { SJRJournals } from "../Models/JournalModels/SJRModel.js";
import mongoose from 'mongoose';

const fetchAllJournals = async (req, res) => {
  try {
    // Extract pagination and search parameters from the query string
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const searchQuery = req.query.search || ''; // Get search query
    const country = req.query.country_flag || ''; // Get country filter
    const publisher = req.query.publisher || ''; // Get publisher filter
    const subjectArea = req.query.subject_area || ''; // Get single subject area

    // Build search filter
    const searchFilter = searchQuery
      ? {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on title
            // { subject_areas: { $regex: searchQuery, $options: 'i' } }, 
          ],
        }
      : {};

    // Build country filter
    const countryFilter = country
      ? { country_flag: { $regex: country, $options: 'i' } } // Use country_flag field
      : {};

    // Build publisher filter
    const publisherFilter = publisher
      ? { publisher: { $regex: publisher, $options: 'i' } }
      : {};

    // Build subject area filter
    const subjectAreaFilter = subjectArea
      ? { subject_areas: { $regex: subjectArea, $options: 'i' } } // Match the single subject area
      : {};

    // Combine all filters
    const combinedFilter = {
      ...searchFilter,
      ...countryFilter,
      ...publisherFilter,
      ...subjectAreaFilter,
    };

    // Fetch total number of journals (for pagination metadata)
    const totalJournals = await SJRJournals.countDocuments(combinedFilter);

    // Fetch paginated journals with combined filter
    const sjrData = await SJRJournals.find(combinedFilter)
      .skip(skip) // Skip documents for pagination
      .limit(limit); // Limit the number of documents returned

    // Send the response with paginated data and metadata
    res.status(200).json({
      journals: sjrData, // Paginated journals
      total: totalJournals, // Total number of journals
      page, // Current page
      limit, // Items per page
    });
  } catch (error) {
    console.error('Error fetching SJR Journals data:', error);
    res.status(500).json({ message: 'Error fetching journals data.' });
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
    const journals = await SJRJournals.find({ _id: { $in: objectIds } });

    res.status(200).json({
      journals,
      total: journals.length,
    });
  } catch (error) {
    console.error('Error fetching journals by IDs:', error);
    res.status(500).json({ message: 'Error fetching journals by IDs.' });
  }
};

export { fetchAllJournals, getJournalsByIds };