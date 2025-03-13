import { GrantForward } from "../Models/GrantsModels/grantForwardModel.js";
import { UkriGrants } from "../Models/GrantsModels/ukri.js";

const fetchAllGrants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const minAmount = req.query.minAmount ? parseFloat(req.query.minAmount) : null;
    const maxAmount = req.query.maxAmount ? parseFloat(req.query.maxAmount) : null;
    const searchQuery = req.query.search ? req.query.search.trim().toLowerCase() : null;
    const descriptionFilter = req.query.descriptionFilter ? req.query.descriptionFilter.trim().toLowerCase() : null; // Add this line

    // Fetch all grants
    const [grantForwardData, ukriGrantsData] = await Promise.all([
      GrantForward.find(),
      UkriGrants.find(),
    ]);

    // Convert "£1,875,000" to 1875000
    const parseAmount = (amount) => {
      if (!amount || typeof amount !== "string") return null;
      return parseFloat(amount.replace(/[£,]/g, ""));
    };

    // Process UkriGrants (convert total_fund to numeric values)
    let ukriGrantsProcessed = ukriGrantsData.map((grant) => ({
      ...grant.toObject(),
      numeric_fund: parseAmount(grant.total_fund),
    }));

    let allGrants = [...ukriGrantsProcessed, ...grantForwardData];

    // Apply amount filtering
    if (minAmount !== null || maxAmount !== null) {
      allGrants = allGrants.filter((grant) => {
        return (
          grant.numeric_fund !== null &&
          (minAmount === null || grant.numeric_fund >= minAmount) &&
          (maxAmount === null || grant.numeric_fund <= maxAmount)
        );
      });
    }

    // Apply title search filtering
    if (searchQuery) {
      allGrants = allGrants.filter((grant) =>
        grant.title?.toLowerCase().includes(searchQuery)
      );
    }

    // Apply description filtering
    if (descriptionFilter) {
      allGrants = allGrants.filter((grant) =>
        grant.description?.toLowerCase().includes(descriptionFilter)
      );
    }

    // Sort by latest createdAt
    allGrants.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Paginate results
    const paginatedGrants = allGrants.slice(skip, skip + limit);

    res.status(200).json({
      grants: paginatedGrants,
      total: allGrants.length,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching grants:", error);
    res.status(500).json({ message: "Error fetching grants data." });
  }
};
export { fetchAllGrants };