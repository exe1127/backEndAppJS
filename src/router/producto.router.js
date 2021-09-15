import app from "../app";
import {
  addToma,
  updateStock,
  insertStock,
  deleteStock,
  getArt,
  getStock,
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
    result = await getStock(articulo);
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
    result = await getArt(articulo);
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

router.get("/getListArt", async (req, res) => {
  try {
    sql = `SELECT * FROM articulosTomaStock WHERE idTom=
    (SELECT idTomSto FROM tomasStockOnline WHERE estTomOnl='NO TRATADO')`;
    result = await deb.executeQuery(sql, function (error) {
      if (error) throw console.log(error);
    });
    result = result.data[0];
    res.json(result);
  } catch (error) {
    res.json(result);
  }
});

router.get("/getUsuario/:id",cors(), async (req, res) => {
  const codigo = req.params.id
  try {
    sql=`SELECT * FROM codigoDeIngreso WHERE codigo=${codigo}`
    result= await deb.executeQuery(sql, function (err){
      if (err) throw console.log(err);
    });
    result=result.data[0];
    res.json(result);
  } catch (error) {
    res.json(result);
  }
})

router.post("/addStockOnline",cors(), async (req, res) => {
  try {
    sql = `UPDATE tomasStockOnline SET estTomOnl='TRATADO' WHERE estTomOnl='NO TRATADO'`;
    result = await deb.executeQuery(sql, function (error) {
      if (error) throw console.log(error);
    });
  }catch (error) {
    res.json(result);
  }
})

router.post("/actualizarArtTomaStock/:id/:cant",cors(), async (req, res) =>{
  const art = req.params.id;
  const cant = req.params.cant;
  try {
    sql = `UPDATE articulosTomaStock SET cantReal=${cant} WHERE codArticu='${art}'`;
    result = await deb.executeQuery(sql, function (error) {
      if (error) throw console.log(error);
    });
  } catch (error){
    res.json(result);
  }
})
export default router;
