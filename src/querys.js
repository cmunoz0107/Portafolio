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
      con.query("select prod.nombre , prov.nombre as 'Proveedor', tipo.nombre as 'Tipo', med.nombre as 'Medida'" +
                "from proveedor prov inner join producto prod on prod.cod_Proveedor=prov.cod_Proveedor " +
                "inner join tipo_producto tipo on prod.cod_Tipo= tipo.cod_Tipo " + 
                "inner join uni_Medida med on prod.cod_Medida=med.cod_Medida", (error, elements) => {
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

  const insertUser = ( nombre, apellidos, correo, password) => {
    return new Promise((resolve, reject) => {
      con.query('INSERT INTO bodeguero (nombre, apellidos, correo, password) VALUES (?, ?, ?, ?);', [ nombre, apellidos, correo, password], (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      });
    });
  }

  const insertChofer = ( nombre, apellidos, edad, correo) => {
    return new Promise((resolve, reject) => {
      con.query('INSERT INTO chofer ( nombre, apellidos, edad, correo) VALUES (?, ?, ?, ?);', [ nombre, apellidos, parseInt(edad), correo], (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      });
    });
  }

  const validateLogin = (email, password) => {
    return new Promise((resolve, reject) => {
      con.query('Select * from bodeguero where correo = ? AND password = ?', [email, password], (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      });
    });
  }

  const ifExistUser = (email) => {
    return new Promise((resolve, reject) => {
      con.query('Select * from bodeguero where correo = ?', [email], (error, elements) => {
        if (error) {
          return reject(error);
        }
        return resolve(elements);
      });
    });
  }

  const ifExistChofer = (email) => {
    return new Promise((resolve, reject) => {
      con.query('Select * from chofer where correo = ?', [email], (error, elements) => {
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
  const login = async (credentials) => {
    const { email, password } = credentials
    try {
      const response = await validateLogin(email, password)
      if(response.length > 0){
        return true
      }
      return false
    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const registerUser = async (data) => {
    const { nombre, apellidos, correo, password } = data
    try {
      const ifExist = await ifExistUser( correo )

      if(ifExist.length > 0){
        return 'Usuario ya existe'
      }

      await insertUser( nombre, apellidos, correo, password )

      return "Usuario Creado"

    } catch (error) {
      console.log(error)
      throw error
    }
  }

  const registerChofer = async (data) => {
    const { nombre, apellidos, edad, correo } = data
    try {
      const ifExist = await ifExistChofer( correo )

      if(ifExist.length > 0){
        return 'Chofer ya existe'
      }

      await insertChofer(  nombre, apellidos, edad, correo )

      return "Chofer creado"

    } catch (error) {
      console.log(error)
      throw error
    }
  }

  return {
    getstock,
    ingresoProducto,
    login,
    registerUser,
    registerChofer
  }
}
export default querys();