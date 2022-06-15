import express from "express";
import bodyParser from "body-parser";
import querys from "./querys.js"


const app = express();
app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);
app.get('/', async (req, res) => { 
  try {
    const resultElements = await querys.getstock();
    res.status(200).json({elements: resultElements});
} catch(e) {
    console.log(e); // console log the error so we can see it in the console
    res.sendStatus(500);
}
})

app.post('/ingreso', async (req, res) => {
  
  const ingreso = req.body.ingreso
  
  const resultElements = await querys.ingresoProducto(ingreso);
  console.log(resultElements)
  if(!resultElements) res.sendStatus(500)
  res.sendStatus(200)
})

app.listen(app.get('port'), () =>{ 
    console.log('server inicializado')
})




 


