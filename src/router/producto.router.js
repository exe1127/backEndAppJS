import app from "../app";
import {
  addToma,
  updateStock,
  insertStock,
  deleteStock,
  getArt,
} from "./Acciones";

const express = require("express");
const router = express.Router();
const deb = require("../baseDatos/conexion");
let articulo;
let sql;
let result;
const cors = require("cors");

router.get("/getStock/:art", cors(), async (req, res) => {
  try {
    articulo = req.params.art;
    sql = `SELECT canSto FROM stock WHERE codArticu='${articulo}'`;
    result = await deb.executeQuery(sql, function (error, results, fields) {
      if (error) throw console.log(error);
    });
    result = result.data[0];
    if (result.length == 0) {
      console.log("no se encontro resultado por lo que el stock es 0");
      res.json({ cantS: 0 });
    } else {
      res.json(result[0]);
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/getArt/:art", cors(), async (req, res) => {
  try {
    articulo = req.params.art;
    const result = await getArt(articulo);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

router.post("/addToma", async (req, res) => {
  const cantS = parseFloat(req.body.cantS);
  const cantR = parseFloat(req.body.cantR);
  const art = req.body.art;
  try {
    const idToma = await addToma();
    let idSto;
    if (cantS == 0) {
      idSto = await insertStock(art, cantR);
    } else {
      if (cantR != 0) {
        idSto = await updateStock(art, cantR);
      } else {
        idSto = await deleteStock(art);
      }
    }
    const get = await getArt(art);
    sql = `INSERT INTO articulosTomaStock (codArticu,descripcio,descAdic,cantSist,cantReal,bobina,posicion,idSto,idTom,idDep,desDep) 
    VALUES ('${art}','${get.descripcio}','${get.descAdic}',${cantS},${cantR},' ','CC-CC-CC-CC',${idSto},${idToma},'${get.idDep}','${get.desDep}')`;
    result = await deb.executeQuery(sql, function (error) {
      if (error) throw console.log(error);
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/getArt", async (req, res) => {
  try {
    sql = "SELECT * FROM articulos";
    result = await deb.executeQuery(sql, function (error) {
      if (error) throw console.log(error);
    });
    result = result.data;
    result = result[0];
    if (result.length == 0) {
      console.log("no se encontro resultado");
      res.json(result[0]);
    } else {
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
});

export default router;
