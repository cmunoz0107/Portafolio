import querys from "./querys.js";
import moment from "moment";

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
    const empleados = await querys.getEmpleado();
    const bodegas = await querys.getBodegas();

    return {
      allProductos,
      choferes,
      bodegueros,
      empleados,
      bodegas,
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
    const stock = await querys.getStockByProduct(productos);
    const newStock = stock ? stock[0].stock : 0;
    const newCantidad = newStock + parseInt(cantidad);
    await querys.updateStock(productos, newCantidad);
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getIngresos = async () => {
  try {
    const ingresos = await querys.getListadoIngresos();
    const newIngresos = setIngresos(ingresos);
    return newIngresos;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getDespachos = async () => {
    try {
      const despachos = await querys.getDespachos();
      const newDespachos = setDespachos(despachos);
      return newDespachos;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

export const despacho = async (data) => {
  const {
    productos,
    cantidad,
    fechaDeEgreso,
    fechaDeCaducidad,
    bodeguero,
    guiaDespacho,
    chofer = null,
    empleado = null,
    bodega = null,
  } = data;
  try {
    const stock = await querys.getStockByProduct(productos);
    const newStock = stock ? stock[0].stock : 0

    if(!(newStock > parseInt(cantidad))) {
        throw "La cantidad debe ser menor al stock de la bodega"
    }
    const newCantidad = newStock - parseInt(cantidad)
    await querys.updateStock(productos, newCantidad);
    await querys.insertDespacho(
      productos,
      cantidad,
      fechaDeEgreso,
      fechaDeCaducidad,
      bodeguero,
      guiaDespacho,
      chofer,
      empleado,
      bodega
    );

    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const setIngresos = (ingresos) => {
  return ingresos.map((e) => {
    const fechaIngreso = moment(e.fecha_ingreso).format("DD-MM-YYYY");
    const fechaCaducidad = moment(e.fecha_Caducidad).format("DD-MM-YYYY");
    return {
      producto: e.Producto,
      cantidad: e.cantidad,
      fechaIngreso: fechaIngreso,
      fechaCaducidad: fechaCaducidad,
      bodeguero: `${e.nombreBodeguero} ${e.apellidoBodeguero}`,
      guiaDespacho: e.GuiaDespacho,
      chofer: `${e.nombreChofer} ${e.apellidoChofer}`,
    };
  });
};

const setDespachos = (despachos) => {
    return despachos.map((e) => {
      const fechaEgreso = moment(e.FechaEgreso).format("DD-MM-YYYY");
      const fechaCaducidad = moment(e.fechaCaducidad).format("DD-MM-YYYY");
      return {
        producto: e.producto,
        cantidad: e.cantidad,
        fechaEgreso: fechaEgreso,
        fechaCaducidad: fechaCaducidad,
        bodeguero: `${e.nombreBodeguero} ${e.apellidoBodeguero}`,
        guiaDespacho: e.Guia,
        chofer: e.nombreChofer ? `${e.nombreChofer} ${e.apellidoChofer}` : "No aplica",
        empleado: e.nombreEmpleado ? `${e.nombreEmpleado} ${e.apellidoEmpleado}` : "No aplica",
        bodega: e.Bodega
      };
    });
  };
