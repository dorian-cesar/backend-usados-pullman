const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token)
    return res.status(401).json({ error: "Acceso denegado. No hay token." });

  try {
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET || "clave_secreta_2026",
    );
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ error: "Token no válido" });
  }
};
