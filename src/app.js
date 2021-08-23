import express from "express";
import config from "./config";
import productoRouter from "./router/producto.router";
import bodyParser from "body-parser";

const app = express();
const cors = require('cors');
app.use(cors());
app.options('*', cors());
app.use(express.urlencoded());
app.use(express.json());      

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});
app.set("port", config.port);
app.use(productoRouter);

export default app;
