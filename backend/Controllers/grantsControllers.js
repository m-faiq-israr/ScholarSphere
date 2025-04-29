import mongoose from "mongoose";
import { UkriGrants } from "../Models/GrantsModels/ukri.js";

const getAllGrants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const parseAmount = (amount) => {
      if (!amount || typeof amount !== "string") return null;
      return parseFloat(amount.replace(/[£,]/g, ""));
    };

    // Get total count first
    const total = await UkriGrants.countDocuments();

    // Fetch only paginated + sorted data
    const ukriGrantsData = await UkriGrants
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const processedGrants = ukriGrantsData.map(grant => ({
      ...grant.toObject(),
      numeric_fund: parseAmount(grant.total_fund),
    }));

    res.status(200).json({
      grants: processedGrants,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching grants:", error);
    res.status(500).json({ message: "Error fetching grants data." });
  }
};


const getGrantsByIds = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({ message: "Invalid or missing ids array." });
    }

    const validIds = ids.filter(id => mongoose.Types.ObjectId.isValid(id));

    if (validIds.length === 0) {
      return res.status(400).json({ message: "No valid IDs provided." });
    }

    const objectIds = validIds.map(id => new mongoose.Types.ObjectId(id));

    const grants = await UkriGrants.find({ _id: { $in: objectIds } });

    const parseAmount = (amount) => {
      if (!amount || typeof amount !== "string") return null;
      return parseFloat(amount.replace(/[£,]/g, ""));
    };

    const processedGrants = grants.map(grant => ({
      ...grant.toObject(),
      numeric_fund: parseAmount(grant.total_fund),
    }));

    res.status(200).json({ grants: processedGrants });
  } catch (error) {
    console.error("Error fetching grants by IDs:", error);
    res.status(500).json({ message: "Error fetching grants by IDs." });
  }
};

  
const searchGrants = async (req, res) => {
  try {
    const searchQuery = req.query.search?.trim();
    if (!searchQuery) {
      return res.status(400).json({ message: "Search query is required." });
    }

    const filteredGrants = await UkriGrants.find({
      title: { $regex: searchQuery, $options: 'i' }, 
    });

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
  
  export { getAllGrants, searchGrants, filterGrants, getGrantsByIds };
