require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");

// Importar Modelos
const Product = require("./models/Product");
const Category = require("./models/Category");
const User = require("./models/User");

// Importar Rutas
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();

// --- 1. Middlewares Globales ---
// CORS debe ir antes que las rutas
app.use(
  cors({
    origin: "*", // En producción: 'https://usados-pullman.netlify.app'
  }),
);
app.use(express.json());

// --- 2. Archivos Estáticos (Mantenedor) ---
// Sirve la carpeta "public" para archivos CSS/JS
app.use(express.static(path.join(__dirname, "public")));

// Ruta específica para acceder al panel: http://localhost:3000/admin
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "admin.html"));
});

// --- 3. Definir Asociaciones de Base de Datos ---
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// --- 4. Rutas de la API ---
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);

// --- 5. Sincronización y Arranque ---
const PORT = process.env.PORT || 3000;

// Sincronización con MySQL
sequelize
  .sync({ force: true }) // Mantiene las tablas actualizadas según los modelos
  .then(() => {
    console.log("✅ Conexión a MySQL exitosa y modelos sincronizados");
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(
        `🛠️  Panel de administración en http://localhost:${PORT}/admin`,
      );
    });
  })
  .catch((err) => {
    console.error("❌ Error al conectar con la base de datos:", err);
  });
