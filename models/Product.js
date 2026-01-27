const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("Product", {
  id: { type: DataTypes.STRING, primaryKey: true }, // Ej: "LJLG-30"
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
  // Guardamos las imágenes como un string separado por comas o JSON
  images: {
    type: DataTypes.TEXT, // En la DB se guarda como un texto largo
    allowNull: true,
    get() {
      const rawValue = this.getDataValue("images");
      // Cuando pides el dato, lo convierte de String a Arreglo
      return rawValue ? JSON.parse(rawValue) : [];
    },
    set(val) {
      // Cuando guardas el dato, convierte el Arreglo a String (JSON)
      this.setDataValue("images", JSON.stringify(val));
    },
  },
  photoCount: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Product;
