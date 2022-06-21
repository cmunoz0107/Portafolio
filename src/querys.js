import mysql from "mysql";

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "conexion_bd_chada",
  port: "3310",
});

con.connect((err) => {
  if (err) throw err;
  console.log("Connected!");
});

const querys = () => {
  const getstock = () => {
    return new Promise((resolve, reject) => {
      con.query(
        "select prod.nombre , prov.nombre as 'Proveedor', tipo.nombre as 'Tipo', med.nombre as 'Medida'" +
          "from proveedor prov inner join producto prod on prod.cod_Proveedor=prov.cod_Proveedor " +
          "inner join tipo_producto tipo on prod.cod_Tipo= tipo.cod_Tipo " +
          "inner join uni_Medida med on prod.cod_Medida=med.cod_Medida",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const updateStock = (cod_Producto, cantidad) => {
    return new Promise((resolve, reject) => {
      con.query(
        "update stock set stock = ? where cod_producto = ? ",
        [cantidad, cod_Producto],
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const insertProducto = (
    cod_Producto,
    cantidad,
    fecha_Ingreso,
    fecha_Caducidad
  ) => {
    return new Promise((resolve, reject) => {
      con.query(
        "insert into ingreso_Productos (cod_Producto, cantidad, fecha_Ingreso, fecha_Caducidad) values(?,?,?,?)",
        [cod_Producto, cantidad, fecha_Ingreso, fecha_Caducidad],
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const insertUser = (nombre, apellidos, correo, password) => {
    return new Promise((resolve, reject) => {
      con.query(
        "INSERT INTO bodeguero (nombre, apellidos, correo, password) VALUES (?, ?, ?, ?);",
        [nombre, apellidos, correo, password],
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const insertChofer = (nombre, apellidos, edad, correo) => {
    return new Promise((resolve, reject) => {
      con.query(
        "INSERT INTO chofer ( nombre, apellidos, edad, correo) VALUES (?, ?, ?, ?);",
        [nombre, apellidos, parseInt(edad), correo],
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const validateLogin = (email, password) => {
    return new Promise((resolve, reject) => {
      con.query(
        "Select * from bodeguero where correo = ? AND password = ?",
        [email, password],
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const ifExistUser = (email) => {
    return new Promise((resolve, reject) => {
      con.query(
        "Select * from bodeguero where correo = ?",
        [email],
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const ifExistChofer = (email) => {
    return new Promise((resolve, reject) => {
      con.query(
        "Select * from chofer where correo = ?",
        [email],
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const getUsers = () => {
    return new Promise((resolve, reject) => {
      con.query(
        "Select bodeguero.nombre, bodeguero.apellidos, bodeguero.correo from bodeguero",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const getProducts = () => {
    return new Promise((resolve, reject) => {
      con.query(
        "SELECT producto.cod_Producto, producto.nombre from producto;",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const getChofer = () => {
    return new Promise((resolve, reject) => {
      con.query(
        "Select chofer.cod_Chofer, chofer.nombre, chofer.apellidos from chofer",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const getBodeguero = () => {
    return new Promise((resolve, reject) => {
      con.query(
        "Select bodeguero.cod_Bodeguero, bodeguero.nombre, bodeguero.apellidos from bodeguero",
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  const insertIngresoProductos = (
    productos,
    cantidad,
    fechaDeIngreso,
    fechaDeCaducidad,
    bodeguero,
    guiaDespacho,
    chofer
  ) => {
    return new Promise((resolve, reject) => {
      con.query(
        "insert into ingreso_Productos(cod_Producto, cantidad, fecha_Ingreso, fecha_Caducidad, cod_Bodeguero, guia_Despacho, cod_Chofer) VALUES (?,?,?,?,?,?,?)",
        [
          productos,
          cantidad,
          fechaDeIngreso,
          fechaDeCaducidad,
          bodeguero,
          guiaDespacho,
          chofer,
        ],
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
          1;
        }
      );
    });
  };

  const getListadoIngresos = () => {
    return new Promise((resolve, reject) => {
      con.query(
        `SELECT
        pro.nombre AS "Producto",
        ing.cantidad,
        ing.fecha_ingreso,
        ing.fecha_Caducidad,
        ing.guia_Despacho AS "GuiaDespacho",
        bod.nombre AS "nombreBodeguero",
        bod.apellidos AS "apellidoBodeguero",
        cho.nombre AS "nombreChofer",
        cho.apellidos AS "apellidoChofer"
      FROM
        ingreso_Productos ing
        INNER JOIN producto pro ON ing.cod_Producto = pro.cod_Producto
        INNER JOIN bodeguero bod ON ing.cod_Bodeguero = bod.cod_Bodeguero
        INNER JOIN chofer cho ON ing.cod_Chofer = cho.cod_Chofer`,
        (error, elements) => {
          if (error) {
            return reject(error);
          }
          return resolve(elements);
        }
      );
    });
  };

  return {
    getstock,
    ifExistChofer,
    ifExistUser,
    validateLogin,
    insertChofer,
    insertUser,
    insertProducto,
    updateStock,
    getUsers,
    getProducts,
    getBodeguero,
    getChofer,
    insertIngresoProductos,
    getListadoIngresos,
  };
};
export default querys();
