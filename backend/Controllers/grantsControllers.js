import { UkriGrants } from "../Models/GrantsModels/ukri.js";

const getAllGrants = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
  
      const ukriGrantsData = await UkriGrants.find();
  
      const parseAmount = (amount) => {
        if (!amount || typeof amount !== "string") return null;
        return parseFloat(amount.replace(/[£,]/g, ""));
      };
  
      let ukriGrantsProcessed = ukriGrantsData.map((grant) => ({
        ...grant.toObject(),
        numeric_fund: parseAmount(grant.total_fund),
      }));
  
      ukriGrantsProcessed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
      const paginatedGrants = ukriGrantsProcessed.slice(skip, skip + limit);
  
      res.status(200).json({
        grants: paginatedGrants,
        total: ukriGrantsProcessed.length,
        page,
        limit,
      });
    } catch (error) {
      console.error("Error fetching grants:", error);
      res.status(500).json({ message: "Error fetching grants data." });
    }
  };
  
  const searchGrants = async (req, res) => {
    try {
      const searchQuery = req.query.search ? req.query.search.trim().toLowerCase() : null;
  
      if (!searchQuery) {
        return res.status(400).json({ message: "Search query is required." });
      }
  
      const ukriGrantsData = await UkriGrants.find();
  
      const filteredGrants = ukriGrantsData.filter((grant) =>
        grant.title?.toLowerCase().includes(searchQuery)
      );
  
      res.status(200).json({ grants: filteredGrants });
    } catch (error) {
      console.error("Error searching grants:", error);
      res.status(500).json({ message: "Error searching grants." });
    }
  };
  
  const filterGrants = async (req, res) => {
    try {
      const minAmount = req.query.minAmount ? parseFloat(req.query.minAmount) : null;
      const maxAmount = req.query.maxAmount ? parseFloat(req.query.maxAmount) : null;
      const descriptionFilter = req.query.descriptionFilter
        ? req.query.descriptionFilter.trim().toLowerCase()
        : null;
  
      const ukriGrantsData = await UkriGrants.find();
  
      const parseAmount = (amount) => {
        if (!amount || typeof amount !== "string") return null;
        return parseFloat(amount.replace(/[£,]/g, ""));
      };
  
      let filteredGrants = ukriGrantsData.map((grant) => ({
        ...grant.toObject(),
        numeric_fund: parseAmount(grant.total_fund),
      }));
  
      if (minAmount !== null || maxAmount !== null) {
        filteredGrants = filteredGrants.filter((grant) => {
          return (
            grant.numeric_fund !== null &&
            (minAmount === null || grant.numeric_fund >= minAmount) &&
            (maxAmount === null || grant.numeric_fund <= maxAmount)
          );
        });
      }
  
      if (descriptionFilter) {
        filteredGrants = filteredGrants.filter((grant) =>
          grant.description?.toLowerCase().includes(descriptionFilter)
        );
      }
  
      res.status(200).json({ grants: filteredGrants });
    } catch (error) {
      console.error("Error filtering grants:", error);
      res.status(500).json({ message: "Error filtering grants." });
    }
  };
  
  export { getAllGrants, searchGrants, filterGrants };
