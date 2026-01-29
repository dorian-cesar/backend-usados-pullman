const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },
    plate: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
    },
    brand: { type: DataTypes.STRING, allowNull: true },
    model: { type: DataTypes.STRING },
    year: { type: DataTypes.INTEGER },
    mileage: { type: DataTypes.STRING },
    location: { type: DataTypes.STRING },
    price: { type: DataTypes.STRING },
    publishedDate: { type: DataTypes.STRING },
    motor: { type: DataTypes.STRING },
    transmission: { type: DataTypes.STRING },
    bodywork: { type: DataTypes.STRING },
    property: { type: DataTypes.STRING },
    chassis: { type: DataTypes.STRING },
    description: { type: DataTypes.TEXT },
    images: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("images");
        try {
          return rawValue ? JSON.parse(rawValue) : [];
        } catch (e) {
          return [];
        }
      },
      set(val) {
        this.setDataValue("images", JSON.stringify(val));
      },
    },
    photoCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    destacado: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
    },
    estado: {
      type: DataTypes.ENUM("disponible", "reservado", "vendido"),
      defaultValue: "disponible",
    },
    categoryId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Categories",
        key: "id",
      },
    },
  },
  {
    tableName: "Products", // Forzamos el nombre exacto de la tabla
    timestamps: true, // Crea createdAt y updatedAt automáticamente
  },
);

module.exports = Product;
