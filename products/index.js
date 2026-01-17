const express = require("express");
const validator = require("validator");

const app = express();
app.use(express.json());
const itemRoutes = require("./routes/item.routes"); 
app.use("/items", itemRoutes);
let items = [];
app.listen(3000, () => {
  console.log("Express JS Backend running on http://localhost:3000");
});
app.get("/", (req, res) => {
  res.json(items);
});
app.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const itemObj = items.find((item) => item.id === id);
  if (!itemObj) {
    return res.status(404).json({ message: "Product/Item not found!" });
  }
  res.status(200).json(itemObj);
});

app.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const itemObj = items.find((item) => item.id === id);

  if (!itemObj) {
    return res.status(404).json({ message: "Item not found!" });
  }

  const index = items.indexOf(itemObj);
  items.splice(index, 1);

  res.json({ message: "Item deleted successfully" });
});

app.post("/", (req, res) => {
  const itemData = req.body;

  if (!itemData.name || itemData.name.trim().length <= 3) {
    return res.status(400).json({ message: "Item Name should be at least 3 characters" });
  }

  if (itemData.istaxable === undefined || !validator.isBoolean(itemData.istaxable.toString())) {
    return res.status(400).json({ message: "istaxable Must be boolean (true/false) !" });
  }

  if (!itemData.unit || itemData.unit.trim() === "") {
    return res.status(400).json({ message: "Unit Required !" });
  }

  if (itemData.price === undefined || !Number.isInteger(itemData.price) || itemData.price < 1) {
    return res.status(400).json({ message: "price must be positive number !" });
  }

  const allowedPercentages = [0, 5, 12, 18, 28];
  if (itemData.taxPercentage !== undefined) {
    if (!Number.isInteger(itemData.taxPercentage) || !allowedPercentages.includes(itemData.taxPercentage)) {
      return res.status(400).json({ message: "Tax Percentage must be [0, 5, 12, 18, 28]" });
    }
  }

  if (itemData.isActive === undefined || !validator.isBoolean(itemData.isActive.toString())) {
    return res.status(400).json({ message: "Active/Deactive, Must be boolean (true/false) !" });
  }

  if (itemData.Date !== undefined && new Date(itemData.Date) > new Date()) {
    return res.status(400).json({ message: "Created Date cannot be in the future" });
  }

  itemData.id = items.length + 1;
  items.push(itemData);

  res.status(201).json({ message: "Item created successfully", Item: itemData });
});

app.put("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const itemObj = items.find((item) => item.id === id);

  if (!itemObj) {
    return res.status(404).json({ message: "Item not found!" });
  }

  const itemData = req.body;

  if (itemData.name !== undefined && itemData.name.trim().length <= 3) {
    return res.status(400).json({ message: "Item Name should be at least 3 characters" });
  }

  if (itemData.istaxable !== undefined && !validator.isBoolean(itemData.istaxable.toString())) {
    return res.status(400).json({ message: "istaxable Must be boolean (true/false) !" });
  }

  if (itemData.unit !== undefined && itemData.unit.trim() === "") {
    return res.status(400).json({ message: "Unit Required !" });
  }

  if (itemData.price !== undefined && (!Number.isInteger(itemData.price) || itemData.price < 1)) {
    return res.status(400).json({ message: "price must be positive number !" });
  }

  if (itemData.taxPercentage !== undefined) {
    const allowedPercentages = [0, 5, 12, 18, 28];
    if (!Number.isInteger(itemData.taxPercentage) || !allowedPercentages.includes(itemData.taxPercentage)) {
      return res.status(400).json({ message: "Tax Percentage must be [0, 5, 12, 18, 28]" });
    }
  }

  if (itemData.isActive !== undefined && !validator.isBoolean(itemData.isActive.toString())) {
    return res.status(400).json({ message: "Active/Deactive, Must be boolean (true/false) !" });
  }

  if (itemData.Date !== undefined && new Date(itemData.Date) > new Date()) {
    return res.status(400).json({ message: "Created Date cannot be in the future" });
  }
  Object.assign(itemObj, itemData);

  res.status(200).json({ message: "Item updated successfully", Item: itemObj });
});
