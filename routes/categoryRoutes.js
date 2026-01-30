const express = require("express");
const router = express.Router();
const Category = require("../models/Category");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/auth");

// 1. OBTENER TODAS LAS CATEGORÍAS (Público)
// Útil para menús de navegación y filtros
router.get("/", async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Product,
          as: "products",
          attributes: ["id", "brand", "model", "plate", "price", "estado"], // Traemos solo lo básico para no sobrecargar
        },
      ],
    });
    console.log("hola");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. OBTENER UNA CATEGORÍA POR ID (Público)
router.get("/:id", async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [{ model: Product, as: "products" }],
    });
    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. CREAR CATEGORÍA (Protegido)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    // Generamos un slug básico (ej: "Buses Interurbanos" -> "buses-interurbanos")
    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ error: "La categoría ya existe o datos inválidos" });
  }
});

// 4. ACTUALIZAR CATEGORÍA (Protegido)
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });

    const slug = name
      ? name.toLowerCase().trim().replace(/\s+/g, "-")
      : category.slug;
    await category.update({ name, slug });

    res.json(category);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 5. ELIMINAR CATEGORÍA (Protegido)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category)
      return res.status(404).json({ error: "Categoría no encontrada" });

    // Verificamos si tiene productos asociados antes de borrar
    const productCount = await Product.count({
      where: { categoryId: req.params.id },
    });
    if (productCount > 0) {
      return res.status(400).json({
        error:
          "No se puede eliminar: Esta categoría tiene vehículos asociados. Muévelos primero.",
      });
    }

    await category.destroy();
    res.json({ message: "Categoría eliminada con éxito" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
