// scripts/createAdmin.js
require("dotenv").config();
const sequelize = require("../config/database");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    // Conectamos a la base de datos
    await sequelize.authenticate();
    console.log("Conexión establecida para crear admin...");

    // Datos del administrador (Cambia estos valores)
    const adminEmail = "super@wit.la";
    const adminPassword = "123456";

    // Verificar si ya existe
    const exists = await User.findOne({ where: { email: adminEmail } });
    if (exists) {
      console.log("El usuario administrador ya existe.");
      process.exit();
    }

    // Crear el usuario (El hook beforeCreate en el modelo User se encargará de encriptar la clave)
    await User.create({
      email: adminEmail,
      password: adminPassword,
    });

    console.log("✅ Usuario administrador creado con éxito:");
    console.log(`Email: ${adminEmail}`);
    process.exit();
  } catch (error) {
    console.error("❌ Error al crear el administrador:", error);
    process.exit(1);
  }
};

createAdmin();
