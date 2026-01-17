const express = require("express");
const validateItem = require("../middlewares/validateItem");
const router = express.Router();

let items = [];


router.get("/", (req, res) => res.json(items));


router.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((i) => i.id === id);
  if (!item) return res.status(404).json({ message: "Item not found!" });
  res.json(item);
});


router.post("/", validateItem, (req, res) => {
  const itemData = req.body;
  itemData.id = items.length + 1;
  items.push(itemData);
  res.status(201).json({ message: "Item created successfully", Item: itemData });
});


router.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const item = items.find((i) => i.id === id);
  if (!item) return res.status(404).json({ message: "Item not found!" });

  Object.assign(item, req.body);
  res.json({ message: "Item updated successfully", Item: item });
});


router.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const itemIndex = items.findIndex((i) => i.id === id);
  if (itemIndex === -1) return res.status(404).json({ message: "Item not found!" });

  items.splice(itemIndex, 1);
  res.json({ message: "Item deleted successfully" });
});

module.exports = router;
