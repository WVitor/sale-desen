
import Express = require('express')
import { UsuarioController } from '../controllers/UsuarioController'
const {funcionalidadesValidacao} = require('../modules/funcionalidadesValidacao')
const {checkAuth} = require('../modules/tokenValidation')
export const usuarioRoutes = Express.Router()

usuarioRoutes.get('/admin', checkAuth, funcionalidadesValidacao, UsuarioController.administrador)

usuarioRoutes.get('/usuarios', checkAuth, funcionalidadesValidacao, UsuarioController.usuarios)
usuarioRoutes.get('/usuarios/:id', checkAuth, funcionalidadesValidacao, UsuarioController.usuarios)

usuarioRoutes.get('/cadastrar-usuario', checkAuth, funcionalidadesValidacao,  UsuarioController.cadastrarUsuario)
usuarioRoutes.post('/cadastrar-usuario', checkAuth, funcionalidadesValidacao,  UsuarioController.cadastrarUsuarioPost)

usuarioRoutes.post('/remover-usuario', checkAuth, funcionalidadesValidacao,  UsuarioController.removerUsuario)