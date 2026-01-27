const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product");

// Obtener categorías con sus productos
router.get("/", async (req, res) => {
  const categories = await Category.findAll({
    include: [{ model: Product, as: "products" }],
  });
  res.json(categories);
});

// Crear categoría
router.post("/", async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
});

module.exports = router;
