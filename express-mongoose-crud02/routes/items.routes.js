const express = require("express");
const router = express.Router();
const Item = require("../models/Item");
const validateItem = require("../middlewares/validateItem");

router.post("/", validateItem, async (req, res) => {
  try {
    const item = new Item(req.body);
    const savedItem = await item.save();

    res.status(201).json({
      message: "Item created successfully",
      data: savedItem,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create item",
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch items",
      error: error.message,
    });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item)
      return res.status(404).json({ message: "Item not found!" });

    res.json(item);
  } catch (error) {
    res.status(400).json({ message: "Invalid item ID" });
  }
});

router.put("/:id", validateItem, async (req, res) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedItem)
      return res.status(404).json({ message: "Item not found!" });

    res.json({
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

    if (!deletedItem)
      return res.status(404).json({ message: "Item not found!" });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: "Invalid item ID" });
  }
});

module.exports = router;

