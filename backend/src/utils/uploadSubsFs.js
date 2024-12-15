const fs = require("fs");
const csvParser = require("csv-parser");
const { connectDB } = require("../config/db"); // Reutiliza la conexión existente
const DefaultSubscription = require("../api/models/defaultSubscription"); // Importa el modelo

// Ruta al archivo CSV
const csvFilePath = __dirname + "/services.csv";


// Función para leer el CSV y guardar los datos en la base de datos
const importDefaultSubscriptions = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    console.log("Conectado a la base de datos");

    const subscriptions = [];

    // Leer y procesar el archivo CSV
    fs.createReadStream(csvFilePath)
      .pipe(csvParser())
      .on("data", (row) => {
        subscriptions.push({
          name: row.Name,
          category: row.Category || "Other",
          logoURL: row["Logo URL"] || null,
        });
      })
      .on("end", async () => {
        try {
          // Insertar los datos en la base de datos
          await DefaultSubscription.insertMany(subscriptions);
          console.log("Datos importados exitosamente:", subscriptions.length, "registros.");
        } catch (error) {
          console.error("Error al importar datos:", error.message);
        } finally {
          process.exit(); // Salir del proceso
        }
      });
  } catch (error) {
    console.error("Error conectando a la base de datos:", error.message);
    process.exit(1);
  }
};

// Ejecutar la importación
importDefaultSubscriptions();
