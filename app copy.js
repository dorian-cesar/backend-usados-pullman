const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const Product = require("./models/Product");
const Category = require("./models/Category");

// Importar rutas
const productRoutes = require("./routes/productRoutes");
const categoryRoutes = require("./routes/categoryRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Asociaciones
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

// Endpoints
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

const PORT = 3000;
sequelize.sync({ alter: true }).then(() => {
  console.log("BBDD Sincronizada con Categorías");
  app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
});
