import express from "express";
import bodyParser from "body-parser";
import {ingresoProductos, login, registerChofer, registerUser, stock, users, selects, getIngresos} from "./controller.js";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.set("port", process.env.PORT || 8080);
app.get("/", async (req, res) => {
  try {
    const resultElements = await stock();
    res.status(200).json({ elements: resultElements });
  } catch (e) {
    console.log(e); 
    res.sendStatus(500);
  }
});

app.post("/login", async (req, res) => {
  const credentials = req.body.credentials;
  try {
    const resultElements = await login(credentials);
    if (!resultElements) res.status(200).json({ valid: false });

    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/registerUser", async (req, res) => {
  const data = req.body.data;
  try {
    const resultElements = await registerUser(data);

    res.status(200).json(resultElements);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/registerChofer", async (req, res) => {
  const data = req.body.data;
  try {
    const resultElements = await registerChofer(data);

    res.status(200).json(resultElements);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/getUsers", async (req, res) => {
  try {
    const resultElements = await users();

    res.status(200).json(resultElements);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/getSelects", async (req, res) => {
  try {
    const resultElements = await selects();

    res.status(200).json(resultElements);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/ingresoProducto", async (req, res) => {
  try {
    const data = req.body.data;
    const resultElements = await ingresoProductos(data);
    res.status(200).json(resultElements);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.get("/getIngresos", async (req, res) => {
  try {
    const resultElements = await getIngresos();
    
    res.status(200).json(resultElements);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(app.get("port"), () => {
  console.log("server inicializado", app.get("port"));
});
