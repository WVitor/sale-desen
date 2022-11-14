import Express = require('express')
import {AutenticacaoController} from "../controllers/AutenticacaoController"
const {notCheckAuth, checkAuth}= require("../modules/tokenValidation") 
export const autenticacaoRoutes = Express.Router()

autenticacaoRoutes.get('/entrar', notCheckAuth, AutenticacaoController.entrar)
autenticacaoRoutes.post('/entrar', notCheckAuth, AutenticacaoController.entrarPost)

autenticacaoRoutes.get('/esqueceu-senha', notCheckAuth, AutenticacaoController.esqueceuSenha)
autenticacaoRoutes.post('/esqueceu-senha', notCheckAuth, AutenticacaoController.esqueceuSenhaPost)

autenticacaoRoutes.get('/redefinir-senha', notCheckAuth, AutenticacaoController.redefinirSenha)
autenticacaoRoutes.post('/redefinir-senha', notCheckAuth, AutenticacaoController.redefinirSenhaPost)

autenticacaoRoutes.get('/sair', checkAuth, AutenticacaoController.sair)
autenticacaoRoutes.post('/token-validacao', notCheckAuth, AutenticacaoController.tokenValidacao)