const express = require("express");
const cors = require("cors");

const router = express.Router();
const Item = require("../models/Item");
const validateItem = require("../middlewares/validateItem");
const authMiddleware = require("../middlewares/authMiddleware");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 3 * 60 * 1000,
  max: 50,
});

router.post("/", validateItem, limiter, async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const queryString = req.query;
    let filter = {};

    if (queryString.name) {
      filter.name = {
        $regex: queryString.name,
        $options: "i", // "i" flag makes regex case-insensitive
      };
    }

    if (queryString.email) {
      filter.email = {
        $regex: queryString.email,
        $options: "i",
      };
    }

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate number of documents to skip for pagination
    const skip = (page - 1) * limit;

    // Determine sort field and sort order (1 = ascending, -1 = descending)
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order == "asc" ? 1 : -1;

    // Query database with filter, pagination and sort, then convert to array
    const items = await Item.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({
        [sortBy]: order,
      });

    res.status(200).json({
      sortOrder: sortBy,
      order: order === 1 ? "asc" : "desc",
      totalItems: items.length,
      data: items,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({
      message: "Invalid Item ID",
    });
  }
});

router.put("/:id", authMiddleware, validateItem, async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json({
      message: "Item updated successfully",
      data: updatedItem,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update item",
      error: error.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid item ID",
    });
  }
});

module.exports = router;

