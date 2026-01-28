require("dotenv").config();
const sequelize = require("../config/database");
const Product = require("../models/Product");
const Category = require("../models/Category");

const seedDatabase = async () => {
  try {
    // Sincronización forzada para limpiar errores de columnas duplicadas
    await sequelize.sync({ force: true });
    console.log("🌱 Base de datos recreada desde cero...");

    await Category.bulkCreate([
      { id: 1, name: "Buses Interurbanos", slug: "buses-interurbanos" },
      { id: 2, name: "Taxibuses", slug: "taxibuses" },
      { id: 3, name: "Camiones", slug: "camiones" },
      { id: 4, name: "Repuestos", slug: "repuestos" },
    ]);

    const productsData = [
      {
        id: 1,
        PLATE: "LJLG-30",
        brand: "MERCEDES BENZ",
        model: "LO-916/48",
        year: 2019,
        mileage: "340.800",
        location: "LLAY LLAY",
        price: "70.000.000",
        publishedDate: "28-01-2026",
        images: ["/uploads/seed-bus1.jpg"],
        photoCount: 1,
        categoryId: 2,
      },
      {
        id: 2,
        PLATE: "KPWX-15",
        brand: "VOLVO",
        model: "B12R",
        year: 2017,
        mileage: "520.000",
        location: "SANTIAGO",
        price: "110.000.000",
        publishedDate: "28-01-2026",
        images: ["/uploads/seed-bus2.jpg"],
        photoCount: 1,
        categoryId: 1,
      },
    ];

    // Generar patentes únicas dinámicamente para los restantes
    const letras = "ABCDE";
    for (let i = 3; i <= 10; i++) {
      productsData.push({
        id: i,
        // Genera patentes tipo: TEST-03, TEST-04...
        PLATE: `TEST-0${i}`,
        brand: i % 2 === 0 ? "SCANIA" : "VOLVO",
        model: `SERIE-${i}00`,
        year: 2018 + (i % 4),
        mileage: `${100 + i * 5}.000`,
        location: "VALPARAISO",
        price: `${30 + i}.500.000`,
        publishedDate: "28-01-2026",
        images: [],
        photoCount: 0,
        categoryId: (i % 4) + 1,
      });
    }

    await Product.bulkCreate(productsData);
    console.log("✅ Categorías y 10 Productos creados exitosamente");
    process.exit();
  } catch (error) {
    console.error("❌ Error en el seeding:", error.message);
    process.exit(1);
  }
};

seedDatabase();
