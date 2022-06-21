import querys from "./querys.js";
import moment from 'moment'

export const ingresoProducto = async (ingreso) => {
  const { cod_Producto, cantidad, fecha_Ingreso, fecha_Caducidad } = ingreso;
  try {
    await querys.insertProducto(
      cod_Producto,
      cantidad,
      fecha_Ingreso,
      fecha_Caducidad
    );

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
export const login = async (credentials) => {
  const { email, password } = credentials;
  try {
    const response = await querys.validateLogin(email, password);
    if (response.length > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const registerUser = async (data) => {
  const { nombre, apellidos, correo, password } = data;
  try {
    const ifExist = await querys.ifExistUser(correo);

    if (ifExist.length > 0) {
      return "Usuario ya existe";
    }

    await querys.insertUser(nombre, apellidos, correo, password);

    return "Usuario Creado";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const registerChofer = async (data) => {
  const { nombre, apellidos, edad, correo } = data;
  try {
    const ifExist = await querys.ifExistChofer(correo);

    if (ifExist.length > 0) {
      return "Chofer ya existe";
    }

    await insertChofer(nombre, apellidos, edad, correo);

    return "Chofer creado";
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const stock = async () => {
  try {
    const response = await querys.getstock();
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const users = async () => {
  try {
    const response = await querys.getUsers();
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
export const selects = async () => {
  try {
    const allProductos = await querys.getProducts();
    const choferes = await querys.getChofer();
    const bodegueros = await querys.getBodeguero();

    return {
      allProductos,
      choferes,
      bodegueros,
    };
  } catch (error) {
    throw error;
  }
};

export const ingresoProductos = async (data) => {
  const {
    productos,
    cantidad,
    fechaDeIngreso,
    fechaDeCaducidad,
    bodeguero,
    guiaDespacho,
    chofer,
  } = data;
  try {
    await querys.insertIngresoProductos(
      productos,
      cantidad,
      fechaDeIngreso,
      fechaDeCaducidad,
      bodeguero,
      guiaDespacho,
      chofer
    );
    await querys.updateStock(productos, cantidad);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getIngresos = async () => {
  try {
    const ingresos = await querys.getListadoIngresos();
    const newIngresos = setIngresos(ingresos)
    return newIngresos;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


const setIngresos = (ingresos) => {
    return ingresos.map(e => {
        const fechaIngreso = moment(e.fecha_ingreso).format("DD-MM-YYYY");
        const fechaCaducidad = moment(e.fecha_ingreso).format("DD-MM-YYYY");
        return {
            producto: e.Producto,
            cantidad: e.cantidad,
            fechaIngreso: fechaIngreso,
            fechaCaducidad: fechaCaducidad,
            bodeguero: `${e.nombreBodeguero} ${e.apellidoBodeguero}`,
            guiaDespacho: e.GuiaDespacho,
            chofer: `${e.nombreChofer} ${e.apellidoChofer}`
        }
    })
}