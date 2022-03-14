const express = require("express");
const router = express.Router();
const deb = require("../baseDatos/conexion");
router.put("/actualizar");
let sql;
let result;

export const addToma = async (nombre) => {
  const f = new Date();
  const fecha = f.getDate() + "/" + (f.getMonth() + 1) + "/" + f.getFullYear();
  const obs = `Toma de stock por aplicacion por ${nombre} en el dia ${fecha}`;
  sql = `INSERT INTO tomasStock (fecTom,obsTom,idDep,desDep) VALUES ('${fecha}','${obs}','1','CC') SELECT SCOPE_IDENTITY()`;
  result = await deb.executeQuery(sql, function (error) {
    if (error) throw console.log(error);
  });
  let idToma = result.data[0];
  idToma = Object.values(idToma[0])[0];
  return idToma;
};

export const getArt = async (articulo) => {
  sql = `SELECT * FROM articulos WHERE codArticu ='${articulo}'`;
  let res;
  result = await deb.executeQuery(sql, function (error) {
    if (error) throw console.log(error);
  });
  result = result.data[0];
  (result.length == 0)?(console.log("no se encontro resultado"),res = {}):res = result[0];
  
  return res;
};

export const getStock = async (articulo) => {
  sql = `SELECT canSto FROM stock WHERE codArticu='${articulo}'`;
  result = await deb.executeQuery(sql, function (error) {
    if (error) throw console.log(error);
  });
  return result.data[0];
};

export const insertStock = async (art, cantR) => {
  sql = `INSERT INTO stock (codArticu,idDep,desDep,idPos,canSto,nomcon) VALUES ('${art}',1,'CC',1,${cantR},' ') SELECT SCOPE_IDENTITY();`;
  result = await deb.executeQuery(sql, function (error) {
    if (error) throw console.log(error);
  });
  let idSto = result.data[0];
  idSto = Object.values(idSto[0])[0];
  return idSto;
};

export const updateStock = async (art, cantR) => {
  sql = `UPDATE  stock SET canSto=${cantR} WHERE codArticu='${art}' SELECT SCOPE_IDENTITY()`;
  result = await deb.executeQuery(sql, function (error) {
    if (error) throw console.log(error);
  });
  let idSto = result.data[0];
  idSto = Object.values(idSto[0])[0];
  return idSto;
};

export const deleteStock = async (art) => {
  sql = `SELECT idSto FROM stock WHERE codArticu='${art}'`;
  result = await deb.executeQuery(sql, function (error) {
    if (error) throw console.log(error);
  });
  let idSto = result.data[0];
  idSto = Object.values(idSto[0])[0];
  sql = `DELETE FROM stock WHERE codArticu='${art}'`;
  result = await deb.executeQuery(sql, function (error) {
    if (error) throw console.log(error);
  });
  return idSto;
};
