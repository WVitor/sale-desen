import Express = require('express')
import {ProdutosController} from "../controllers/ProdutoController"
const {funcionalidadesValidacao} = require('../modules/funcionalidadesValidacao')
const {checkAuth} = require('../modules/tokenValidation')
import moment = require('moment');
export const produtosRoutes = Express.Router()

produtosRoutes.get('/dashboard', checkAuth, ProdutosController.dashboard)

produtosRoutes.get('/estoque', checkAuth, funcionalidadesValidacao, ProdutosController.estoque)
produtosRoutes.get('/estoque/:page', checkAuth, funcionalidadesValidacao, ProdutosController.estoque)

produtosRoutes.get('/cadastrar-produto', checkAuth, funcionalidadesValidacao, ProdutosController.cadastrarProduto)
produtosRoutes.post('/cadastrar-produto', checkAuth, funcionalidadesValidacao, ProdutosController.cadastrarProdutoPost)

produtosRoutes.get('/editar-produto/:id', checkAuth, funcionalidadesValidacao, ProdutosController.editarProduto)
produtosRoutes.post('/editar-produto', checkAuth, funcionalidadesValidacao, ProdutosController.editarProdutoPost)

produtosRoutes.post('/baixa-produto', checkAuth, funcionalidadesValidacao, ProdutosController.baixaProduto)
produtosRoutes.post('/remover-produto', checkAuth, funcionalidadesValidacao, ProdutosController.removerProduto)

produtosRoutes.get('/arquivos/planilha', checkAuth, funcionalidadesValidacao, ProdutosController.exportarPlanilha)
produtosRoutes.get(`/arquivos/relatorio-${moment().format("DD-MM-YYYY")}`, checkAuth, funcionalidadesValidacao, ProdutosController.exportarRelatorio)
