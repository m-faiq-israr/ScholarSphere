import { SJRJournals } from "../Models/JournalModels/SJRModel.js";

const fetchAllJournals = async (req, res) => {
  try {
    // Extract pagination and search parameters from the query string
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip
    const searchQuery = req.query.search || ''; // Get search query

    // Build search filter
    const searchFilter = searchQuery
      ? {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on title
            // { publisher: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on publisher
            { subject_areas: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on subject areas
          ],
        }
      : {};

    // Fetch total number of journals (for pagination metadata)
    const totalJournals = await SJRJournals.countDocuments(searchFilter);

    // Fetch paginated journals with search filter
    const sjrData = await SJRJournals.find(searchFilter)
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

export { fetchAllJournals };