import express from "express";
import bodyParser from "body-parser";
import querys from "./querys.js";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.set("port", process.env.PORT || 8080);
app.get("/", async (req, res) => {
  try {
    const resultElements = await querys.getstock();
    res.status(200).json({ elements: resultElements });
  } catch (e) {
    console.log(e); // console log the error so we can see it in the console
    res.sendStatus(500);
  }
});

app.post("/ingreso", async (req, res) => {
  const ingreso = req.body.ingreso;

  const resultElements = await querys.ingresoProducto(ingreso);
  console.log(resultElements);
  if (!resultElements) res.sendStatus(500);
  res.sendStatus(200);
});

app.post("/login", async (req, res) => {
  const credentials = req.body.credentials;
  try {
    const resultElements = await querys.login(credentials);
    if (!resultElements) res.status(200).json({ valid: false });

    res.status(200).json({ valid: true });
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/registerUser", async (req, res) => {
  const data = req.body.data;
  try {
    const resultElements = await querys.registerUser(data);

    res.status(200).json(resultElements);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post("/registerChofer", async (req, res) => {
  const data = req.body.data;
  try {
    const resultElements = await querys.registerChofer(data);

    res.status(200).json(resultElements);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.listen(app.get("port"), () => {
  console.log("server inicializado");
});
