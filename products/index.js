const express = require("express");

const app = express();
app.use(express.json());


// start the server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});

let products = [];


// Add new Product
app.post("/addproduct", (req, res) => {
  const { name, price } = req.body;

  if (!name || !price) {
    return res.status(400).json({ message: "Product Name and price are required !" });
  }

  const newproduct = {
    id: products.length + 1,
    name,
    price
  };

  products.push(newproduct);

  res.status(201).json({
    message: "product added successfully",
    product: newproduct
  });

  // Read All Products
app.get("/products", (req, res) => {
  res.json(products);
});

// Read single Product
app.get("/products/:id", (req, res) => {
  const product = products.find(u => u.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }

  res.json(product);
});

// Update the Product
app.put("/products/:id", (req, res) => {
  const product = products.find(u => u.id === parseInt(req.params.id));

  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }

  product.name = req.body.name || product.name;
  product.price = req.body.price || product.price;

  res.json({ message: "product updated", product });
});

// Delete the Product
app.delete("/products/:id", (req, res) => {
  products = products.filter(u => u.id !== parseInt(req.params.id));
  res.json({ message: "product deleted" });
});

});
