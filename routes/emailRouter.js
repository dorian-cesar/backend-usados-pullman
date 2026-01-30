const express = require("express");
const router = express.Router();
const sgMail = require("@sendgrid/mail");

console.log("--> Cargando Email Router...");

// Configura tu API KEY (Obtenla en app.sendgrid.com)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.post("/send", async (req, res) => {
  const { to, subject, text, html } = req.body;

  const msg = {
    to: to, // Correo del destinatario
    from: "viajes@pullmanbus.cl", // DEBE estar verificado en SendGrid
    subject: subject || "Contacto desde el Sistema de Vehículos",
    text: text || "Contenido del mensaje",
    html: html || `<strong>${text}</strong>`, // Soporta HTML para correos con estilo
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: "Correo enviado exitosamente" });
  } catch (error) {
    console.error("Error en SendGrid:", error.response?.body || error.message);
    res.status(500).json({ error: "Error al enviar el correo" });
  }
});

module.exports = router;
