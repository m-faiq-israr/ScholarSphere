import { GrantForward } from "../Models/GrantsModels/grantForwardModel.js";
import { UkriGrants } from "../Models/GrantsModels/ukri.js";

const fetchAllGrants = async (req, res) => {
  try {
    // Extract pagination parameters from the query string
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit; // Calculate the number of documents to skip

    // Fetch all grants from both collections
    const [grantForwardData, ukriGrantsData] = await Promise.all([
      GrantForward.find({}), // Fetch all GrantForward data
      UkriGrants.find({}), // Fetch all UkriGrants data
    ]);

    // Combine the data into a single array
    const allGrants = [...grantForwardData, ...ukriGrantsData];

    // Sort the combined array 
    allGrants.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Example: Sort by createdAt

    // Apply pagination to the combined array
    const paginatedGrants = allGrants.slice(skip, skip + limit);

    // Get the total number of grants
    const totalGrants = allGrants.length;

    // Send the response
    res.status(200).json({
      grants: paginatedGrants, // Paginated grants
      total: totalGrants, // Total number of grants
      page, // Current page
      limit, // Items per page
    });
  } catch (error) {
    console.error('Error fetching data from grants:', error);
    res.status(500).json({ message: 'Error fetching data from one or more collections.' });
  }
};

export { fetchAllGrants };