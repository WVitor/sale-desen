import Express = require('express')
import { TipoUsuarioController } from '../controllers/TipoUsuarioController'
const {funcionalidadesValidacao} = require('../modules/funcionalidadesValidacao')
const {checkAuth} = require('../modules/tokenValidation')
export const tipoUsuarioRoutes = Express.Router()

tipoUsuarioRoutes.get('/tipos-usuario', checkAuth, funcionalidadesValidacao, TipoUsuarioController.tiposUsuario)
tipoUsuarioRoutes.get('/tipos-usuario/:page', checkAuth, TipoUsuarioController.tiposUsuario)

tipoUsuarioRoutes.get('/cadastrar-tipo', checkAuth, funcionalidadesValidacao, TipoUsuarioController.cadastrarTipoUsuario)
tipoUsuarioRoutes.post('/cadastrar-tipo', checkAuth, funcionalidadesValidacao, TipoUsuarioController.cadastrarTipoUsuarioPost)

tipoUsuarioRoutes.post('/remover-tipo', checkAuth, funcionalidadesValidacao, TipoUsuarioController.removerTipoUsuario) 

tipoUsuarioRoutes.get('/permissoes/:tipo', checkAuth, funcionalidadesValidacao, TipoUsuarioController.permissoes)
tipoUsuarioRoutes.post('/permissoes', checkAuth, funcionalidadesValidacao,  TipoUsuarioController.permissoesPost)