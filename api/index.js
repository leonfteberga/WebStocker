import express from "express"
import produtosRoutes from "./routes/produtos.js"
import bodyParser from "body-parser";
import cors from "cors"

const app = express()
app.use(bodyParser.json());

app.use(express.json())
app.use(cors())

app.use("/", produtosRoutes)

app.listen(3307)