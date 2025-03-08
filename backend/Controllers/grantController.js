import { GrantForward } from "../Models/GrantsModels/grantForwardModel.js";
import { UkriGrants } from "../Models/GrantsModels/ukri.js";

const fetchAllGrants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchQuery = req.query.search || ''; // Get search query

    // Build search filter
    const searchFilter = searchQuery
      ? {
          $or: [
            { title: { $regex: searchQuery, $options: 'i' } }, // Case-insensitive search
            { description: { $regex: searchQuery, $options: 'i' } },
          ],
        }
      : {};

    // Fetch grants with search filter
    const [grantForwardData, ukriGrantsData] = await Promise.all([
      GrantForward.find(searchFilter),
      UkriGrants.find(searchFilter),
    ]);

    // Combine and sort data
    const allGrants = [...grantForwardData, ...ukriGrantsData];
    allGrants.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginate results
    const paginatedGrants = allGrants.slice(skip, skip + limit);
    const totalGrants = allGrants.length;

    res.status(200).json({
      grants: paginatedGrants,
      total: totalGrants,
      page,
      limit,
    });
  } catch (error) {
    console.error('Error fetching grants:', error);
    res.status(500).json({ message: 'Error fetching grants data.' });
  }
};

export { fetchAllGrants };