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
    const descriptionFilter = req.query.descriptionFilter?.trim().toLowerCase() || null;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const matchStage = {
        $and: [
          { link: { $exists: true, $ne: "" } }
        ]
      };
      
      if (descriptionFilter) {
        matchStage.$and.push({
          $or: [
            { title: { $regex: descriptionFilter, $options: 'i' } },
            { description: { $regex: descriptionFilter, $options: 'i' } }
          ]
        });
      }
      
      

    // Add total_fund filtering via a projected numeric field
    const pipeline = [
      { $match: matchStage },
      {
        $addFields: {
          numeric_fund: {
            $cond: {
              if: { $isNumber: "$total_fund" },
              then: "$total_fund",
              else: {
                $convert: {
                  input: {
                    $replaceAll: {
                      input: "$total_fund",
                      find: ",",
                      replacement: ""
                    }
                  },
                  to: "double",
                  onError: null,
                  onNull: null
                }
              }
            }
          }
        }
      },
    ];

    // Add fund filtering if applicable
    const fundMatch = {};
    if (minAmount !== null) fundMatch.$gte = minAmount;
    if (maxAmount !== null) fundMatch.$lte = maxAmount;
    if (Object.keys(fundMatch).length > 0) {
      pipeline.push({ $match: { numeric_fund: fundMatch } });
    }

    pipeline.push(
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          grants: [
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    );

    const result = await Grants.aggregate(pipeline);
    const grants = result[0]?.grants || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    res.status(200).json({ grants, total, page, limit });
  } catch (error) {
    console.error("Error filtering grants:", error);
    res.status(500).json({ message: "Error filtering grants." });
  }
};



  


export { getAllGrants, getGrantsByIds, searchGrants, filterGrants };
