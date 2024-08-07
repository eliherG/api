const express = require("express");
const nodemailer = require("nodemailer");
const cors = require('cors');
const bodyParser = require("body-parser");
require("dotenv").config();

const port = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Nodemailer configuration
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKE,
  },
});

// Routes
app.post("/api/send-email", (req, res) => {
  const { nombre_completo, correo, telefono, monto, tipo_credito } = req.body;

  let mailOptions = {
    from: "support@eldefiar.com",
    to: "support@eldefiar.com",
    subject: "Bienvenido a El de Fiar",
    text: `Name: ${nombre_completo}\nEmail: ${correo}\nTeléfono: ${telefono}\nMonto: ${monto}\nTipo de Credito: ${tipo_credito}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log("Error " + err);
      return res.status(500).json({ error: "Error sending email." });
    } else {
      console.log("Email sent successfully");
      return res.status(200).json({ message: "Email sent successfully" });
    }
  });
});

// Serve static files from 'public' directory (optional if you have a frontend built separately)
// app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
