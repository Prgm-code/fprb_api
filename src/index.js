const express = require("express");
const fprbRouter = require("./routes/fprbRouter.js");
const morgan = require("morgan");
const cors = require("cors");
const { handleMqttInit, handleMqttMessage } = require('./controllers/fprbmqttController.js')
const dotenv = require("dotenv");

dotenv.config();


const app = express();

const whitelist = [process.env.LOCAL_URL];  // Lista de dominios permitidos

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) { 
      // Permitir que la solicitud continúe si el origin está en la lista o si es una solicitud desde Postman o similar (origin undefined).
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}

app.use(morgan("dev"));
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use("/fprb", fprbRouter);

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

handleMqttInit();
handleMqttMessage();

/* Error Handling */

// Manejo de errores 404
app.use((req, res, next) => {
    next(createError(404, "Route not found"));
  });
  
  // Middleware de manejo de errores
  app.use((err, req, res, next) => {
    console.error(err);
  
    // Si el error no tiene un código de estado HTTP, establecerlo en 500
    let statusCode = err.status || 500;
  
    // Enviar el error al cliente
    res.status(statusCode).json({
      status: "error",
      statusCode: statusCode,
      message: err.message,
      data: err.data, // Esto contendrá el objeto de error original
    });
  });
  
// Configuración del puerto
const port = process.env.PORT || 7000;

// Comenzar a escuchar en el puerto
app.listen(port, () => {
  console.info(`Application running at port ${port}`);
});
