import mysql from "mysql";

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "conexion_bd_chada",
  port: "3310"
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

const querys = () => {
  const getstock = () => {
    return new Promise((resolve, reject) => {
      con.query('SELECT * FROM stock ', (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      });
    });
  }

  const updateStock = (cod_Producto, cantidad) => {
    return new Promise((resolve, reject) => {
      con.query('update stock set stock = ? where cod_producto = ? ', [cantidad, cod_Producto], (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      });
    });
  }

  const insertProducto = (cod_Producto, cantidad, fecha_Ingreso, fecha_Caducidad) => {
    return new Promise((resolve, reject) => {
      con.query('insert into ingreso_Productos (cod_Producto, cantidad, fecha_Ingreso, fecha_Caducidad) values(?,?,?,?)', [cod_Producto, cantidad, fecha_Ingreso, fecha_Caducidad], (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      });
    });
  }

  const ingresoProducto = async (ingreso) => {
    const { cod_Producto, cantidad, fecha_Ingreso, fecha_Caducidad } = ingreso

    try {
      await insertProducto(cod_Producto, cantidad, fecha_Ingreso, fecha_Caducidad)
      await updateStock(cod_Producto, cantidad)
      return true
    } catch (error) {
      console.log(error)
      return false
    }

  }
  return {
    getstock,
    ingresoProducto
  }
}
export default querys();