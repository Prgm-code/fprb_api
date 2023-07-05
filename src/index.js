const express = require("express");
const fprbRouter = require("./routes/fprbRouter.js");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));

app.use("/fprb", fprbRouter);

app.get("/", (req, res, next) => {
  res.send("Hello World!");
});

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
