import express from 'express';
import { Conference365 } from '../Models/ConferenceModels/conference365Model.js';
import { ConferenceLists } from '../Models/ConferenceModels/conferenceListsModel.js';
import { ConferenceMonkey } from '../Models/ConferenceModels/conferenceMonkeyModel.js';
import { ConferenceService } from '../Models/ConferenceModels/conference_serviceModel.js';
import { WasetConference } from '../Models/ConferenceModels/wasetConferenceModel.js';

const fetchAllConferences = async (req, res) => {
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
            // { description: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on description
            { location: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search on location
          ],
        }
      : {};

    // Fetch all conferences from all collections with search filter
    const [conference365Data, conferenceListsData, conferenceMonkeyData, conferenceServiceData, wasetConferenceData] = await Promise.all([
      Conference365.find(searchFilter),
      ConferenceLists.find(searchFilter),
      ConferenceMonkey.find(searchFilter),
      ConferenceService.find(searchFilter),
      WasetConference.find(searchFilter),
    ]);

    // Combine the data into a single array
    const allConferences = [
      ...conference365Data,
      ...conferenceListsData,
      ...conferenceMonkeyData,
      ...conferenceServiceData,
      ...wasetConferenceData,
    ];

    // Sort the combined array (example: sort by createdAt in descending order)
    allConferences.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Apply pagination to the combined array
    const paginatedConferences = allConferences.slice(skip, skip + limit);

    // Get the total number of conferences
    const totalConferences = allConferences.length;

    // Send the response
    res.status(200).json({
      conferences: paginatedConferences, // Paginated conferences
      total: totalConferences, // Total number of conferences
      page, // Current page
      limit, // Items per page
    });
  } catch (error) {
    console.error('Error fetching data from conferences:', error);
    res.status(500).json({ message: 'Error fetching data from one or more collections.' });
  }
};

export { fetchAllConferences };