import mongoose from "mongoose";
import { Grants } from "../Models/GrantsModels/grantsModel.js";

const parseAmount = (amount) => {
  if (!amount || typeof amount !== "string") return null;
  const cleaned = amount.replace(/[^0-9.]/g, "");
  return cleaned ? parseFloat(cleaned) : null;
};

const getAllGrants = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { link: { $exists: true, $ne: null } };

    const total = await Grants.countDocuments();

    const grants = await Grants.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const processed = grants.map(grant => ({
      ...grant,
      numeric_fund: parseAmount(grant.total_fund)
    }));

    res.status(200).json({ grants: processed, total, page, limit });
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

    const results = await Grants.find({ _id: { $in: objectIds } });

    const processedGrants = results.map(grant => ({
      ...grant.toObject(),
      numeric_fund: parseAmount(grant.total_fund)
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

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchRegex = { title: { $regex: searchQuery, $options: 'i' } };

    const total = await Grants.countDocuments(searchRegex);

    const results = await Grants.find(searchRegex)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({ grants: results, total, page, limit });
  } catch (error) {
    console.error("Error searching grants:", error);
    res.status(500).json({ message: "Error searching grants." });
  }
};

const filterGrants = async (req, res) => {
  try {
    const minAmount = req.query.minAmount ? parseFloat(req.query.minAmount) : null;
    const maxAmount = req.query.maxAmount ? parseFloat(req.query.maxAmount) : null;
    const descriptionFilter = req.query.descriptionFilter?.trim();

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Mongoose base query
    const matchQuery = {
      link: { $exists: true, $ne: "" },
    };


    if (descriptionFilter) {
      matchQuery.$or = [
        { title: { $regex: descriptionFilter, $options: "i" } },
        { description: { $regex: descriptionFilter, $options: "i" } },
      ];
    }

    // Fetch a larger number to filter locally
    const rawGrants = await Grants.find(matchQuery).sort({ createdAt: -1 }).lean();

    // Apply amount filter using parseAmount()
    const filtered = rawGrants.filter((grant) => {
      const amount = parseAmount(grant.total_fund);
      if (amount === null) return false;

      if (minAmount !== null && amount < minAmount) return false;
      if (maxAmount !== null && amount > maxAmount) return false;
      return true;
    });

    const total = filtered.length;
    const paginated = filtered.slice(skip, skip + limit);

    res.status(200).json({ grants: paginated, total, page, limit });
  } catch (error) {
    console.error("Error filtering grants:", error);
    res.status(500).json({ message: "Error filtering grants." });
  }
};

const opportunity_filter = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    let query = {};

    if (status === "forecasted") {
      query.opportunity_status = "forecasted";
    } else if (status === "Upcoming") {
      query.opportunity_status = "Upcoming";
    } else if (status === "Open") {
      query.$or = [
        { opportunity_status: { $nin: ["forecasted", "Upcoming"] } },
        { opportunity_status: { $exists: false } },
        { opportunity_status: null },
        { opportunity_status: "" }
      ];
    }

    const results = await Grants.find(query).skip(skip).limit(Number(limit));
    const total = await Grants.countDocuments(query);

    const processed = results.map(grant => ({
      ...grant.toObject(),
      numeric_fund: parseAmount(grant.total_fund)
    }));

    res.status(200).json({ grants: processed, total });
  } catch (error) {
    console.error("Error filtering by opportunity_status:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getOpportunityStatusCounts = async (req, res) => {
  try {
    const all = await Grants.countDocuments(); 

    const forecasted = await Grants.countDocuments({ opportunity_status: "forecasted" });

    const upcoming = await Grants.countDocuments({ opportunity_status: "Upcoming" });

    const open = await Grants.countDocuments({
      $or: [
        { opportunity_status: { $nin: ["forecasted", "Upcoming"] } },
        { opportunity_status: { $exists: false } },
        { opportunity_status: null },
        { opportunity_status: "" }
      ]
    });

    res.status(200).json({
      all,
      open,
      upcoming,
      forecasted
    });
  } catch (error) {
    console.error("Error getting opportunity status counts:", error);
    res.status(500).json({ error: "Server error" });
  }
};


export { getAllGrants, getGrantsByIds, searchGrants, filterGrants, opportunity_filter, getOpportunityStatusCounts };
 