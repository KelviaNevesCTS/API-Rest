const express = require("express");
const cors = require("cors");
const db = require("./app/models");
const app = express();
const Role = db.role;
var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.json({ message: "Welcome to diego application." });
});
const PORT = process.env.PORT || 8080;
// Sincronizar las tablas antes de iniciar el servidor
db.sequelize.sync({ force: true })
  .then(() => {
    console.log('Tables have been created.');
    // Lógica de inicialización de datos
    initial();
    // Iniciar el servidor después de que las tablas se hayan creado
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  })
  .catch(err => {
    console.error('Error while creating tables:', err);
  });
function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
  Role.create({
    id: 2,
    name: "moderator"
  });
  Role.create({
    id: 3,
    name: "admin"
  });
}
// Requerir y configurar las rutas después de la sincronización de la base de datos
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
