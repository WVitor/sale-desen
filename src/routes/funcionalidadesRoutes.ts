import Express = require('express')
import {FuncionalidadesController} from "../controllers/FuncionalidadesController"
const {checkAuth} = require('../modules/tokenValidation')
const {funcionalidadesValidacao} = require('../modules/funcionalidadesValidacao')
export const funcionalidadesRoutes = Express.Router()

funcionalidadesRoutes.get('/funcionalidades', checkAuth, funcionalidadesValidacao, FuncionalidadesController.funcionalidades)
funcionalidadesRoutes.get('/funcionalidades/:page', checkAuth, funcionalidadesValidacao, FuncionalidadesController.funcionalidades)

funcionalidadesRoutes.get('/cadastrar-funcionalidade', checkAuth, funcionalidadesValidacao, FuncionalidadesController.cadastrarFuncionalidade)
funcionalidadesRoutes.post('/cadastrar-funcionalidade', checkAuth, funcionalidadesValidacao, FuncionalidadesController.cadastrarFuncionalidadePost)

funcionalidadesRoutes.post('/remover-funcionalidade', checkAuth, funcionalidadesValidacao, FuncionalidadesController.removerFuncionalidade)