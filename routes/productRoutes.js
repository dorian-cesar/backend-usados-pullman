const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Para borrar archivos físicos
const Product = require("../models/Product");
const Category = require("../models/Category");
const authMiddleware = require("../middleware/auth");

// Configuración de Multer
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// 1. OBTENER TODOS LOS PRODUCTOS (Público)
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [{ model: Category, as: "category", attributes: ["name"] }],
      order: [["createdAt", "DESC"]],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. OBTENER UN PRODUCTO POR ID (Público)
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: "category" }],
    });
    if (!product)
      return res.status(404).json({ error: "Vehículo no encontrado" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. CREAR PRODUCTO CON IMÁGENES (Protegido)
router.post(
  "/",
  authMiddleware,
  upload.array("photos", 10),
  async (req, res) => {
    try {
      const productData = req.body;
      if (req.files && req.files.length > 0) {
        const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
        productData.images = filePaths;
        productData.photoCount = filePaths.length;
      }
      const product = await Product.create(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

// 4. ACTUALIZAR PRODUCTO (Protegido)
router.put(
  "/:id",
  authMiddleware,
  upload.array("photos", 10),
  async (req, res) => {
    try {
      const product = await Product.findByPk(req.params.id);
      if (!product)
        return res.status(404).json({ error: "Vehículo no encontrado" });

      const updateData = req.body;

      // Si se suben nuevas fotos, reemplazamos las anteriores
      if (req.files && req.files.length > 0) {
        // Opcional: Borrar fotos antiguas del disco
        if (product.images && product.images.length > 0) {
          product.images.forEach((img) => {
            const fullPath = path.join(__dirname, "../public", img);
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
          });
        }
        const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
        updateData.images = filePaths;
        updateData.photoCount = filePaths.length;
      }

      await product.update(updateData);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);

// 5. ELIMINAR PRODUCTO (Protegido)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ error: "Vehículo no encontrado" });

    // Borrar imágenes del disco antes de eliminar de la DB
    if (product.images && product.images.length > 0) {
      product.images.forEach((img) => {
        const fullPath = path.join(__dirname, "../public", img);
        if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
      });
    }

    await product.destroy();
    res.json({ message: "Vehículo eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
