const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const Category = require("../models/Category");
const authMiddleware = require("../middleware/auth");

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: "public/uploads/",
  filename: (req, file, cb) => {
    // Nombre único: patente-fecha-nombreoriginal
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// RUTA PARA CREAR PRODUCTO CON IMÁGENES
router.post(
  "/",
  authMiddleware,
  upload.array("photos", 10),
  async (req, res) => {
    try {
      const productData = req.body;

      // Obtenemos las rutas de los archivos subidos
      if (req.files) {
        const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
        productData.images = filePaths; // Sequelize lo convertirá a JSON por el setter
        productData.photoCount = filePaths.length;
      }

      const product = await Product.create(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
);
// 1. OBTENER TODOS LOS PRODUCTOS (Público)
router.get("/", async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
          attributes: ["name"],
        },
      ],
      order: [["createdAt", "DESC"]], // Los más nuevos primero
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. OBTENER UN PRODUCTO POR PATENTE/ID (Público)
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
module.exports = router;
