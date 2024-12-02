import express from "express";
import { addProdutos, deleteProdutos, getProdutos, updateProdutos, getContagemProdutos, getExclusoes, register, login, getSomaPrecosDisponiveis, getSomaQuantidadesDisponiveis } from "../controllers/produtos.js";


const router = express.Router()

router.get("/", getProdutos)

router.post("/", addProdutos)

router.put("/:id", updateProdutos)

router.delete("/:id", deleteProdutos)

router.get('/contagem', getContagemProdutos)

router.get('/entradas', getProdutos);

router.get('/exclusoes', getExclusoes);

router.post("/register", register); 

router.post("/login", login);    

router.get('/produtos/soma-precos-disponiveis', getSomaPrecosDisponiveis);  

router.get('/produtos/quantidade-total', getSomaQuantidadesDisponiveis);  

export default router