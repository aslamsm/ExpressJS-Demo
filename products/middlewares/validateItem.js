const validateItem = (req, res, next) => {
  const itemData = req.body;
  const validator = require("validator");

  if (itemData.name !== undefined) {
    if (itemData.name.trim().length <= 2) {
      return res.status(400).json({
        message: "Item Name should be at least 2 characters",
      });
    }
  }

  if (itemData.istaxable !== undefined) {
    if (!validator.isBoolean(itemData.istaxable.toString())) {
      return res.status(400).json({
        message: "istaxable Must be boolean (true/false) !",
      });
    }
  }

  if (itemData.unit !== undefined) {
    if (!itemData.unit || itemData.unit.trim() === "") {
      return res.status(400).json({
        message: "Item Unit is Required !",
      });
    }
  }

  if (itemData.price !== undefined) {
    if (!Number.isInteger(itemData.price) || itemData.price < 1) {
      return res.status(400).json({
        message: "price must be positive number !",
      });
    }
  }

  if (itemData.taxPercentage !== undefined) {
    const allowedPercentages = [0, 5, 12, 18, 28];
    if (
      !Number.isInteger(itemData.taxPercentage) ||
      !allowedPercentages.includes(itemData.taxPercentage)
    ) {
      return res.status(400).json({
        message: "Tax Percentage must be [0, 5, 12, 18, 28]",
      });
    }
  }

  if (itemData.isActive !== undefined) {
    if (!validator.isBoolean(itemData.isActive.toString())) {
      return res.status(400).json({
        message: "Active/Deactive, Must be boolean (true/false) !",
      });
    }
  }

  if (itemData.Date !== undefined) {
    if (new Date(itemData.Date) > new Date()) {
      return res.status(400).json({
        message: "Created Date cannot be in the future",
      });
    }
  }
  next();
};

module.exports = validateItem;

