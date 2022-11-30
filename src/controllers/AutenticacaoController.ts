import { UsuarioRepository } from "../repositories/UsuarioRepository"
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cripto = require('crypto')
const mailer = require('../modules/mailer')



export class AutenticacaoController{
    static async entrar(req, res){
        try {
            return res.render('auth/login')
        } catch (error) {
            console.log(error)
        }
    }
    static async entrarPost(req, res){
        try {
            const {email, password} = req.body

            if(!email || !password){
                req.flash('message',  "preencha todos os campos")
                return res.render('auth/login') 
            }

            const usuario = await UsuarioRepository.acharPorEmailJuntarTipo(email)
            if(!usuario){
                req.flash('message', 'Usuario não encontrado.')
                return res.render('auth/login') 
            }
    
            const validarSenha = bcrypt.compareSync(password, usuario.password)
            if(!validarSenha){
                req.flash('message', 'Senha incorreta.')
                return res.render('auth/login')
            }

            if(usuario.tipo.nivel >= 2){
                req.session["levelAdmin"] = true
            }
            if(usuario.tipo.nivel == 3){
                req.session["levelMaster"] = true
            }

            const token = jwt.sign({userId: usuario.id}, process.env.SECRET, { expiresIn: 1800 /*30 minutos em segundos*/})
            req.session["userId"] = usuario.id
            req.session["token"] = token
 
            req.flash('message', `Seja bem vindo(a) ${usuario.nome}.`)   
            req.session.save(()=>{ 
                return res.redirect(`/dashboard`)
            })
           
        } catch (error) {
            console.log(error)
        }
    }

    static sair(req, res){
        req.session.destroy()
        return res.redirect(`/entrar`)
    }

    static esqueceuSenha(req, res){
       return res.render('auth/esqueceuSenha')
    }

    static async esqueceuSenhaPost(req, res){
        try {
            const email = req.body.email
            const usuario = await UsuarioRepository.findOneBy({email: email})
            
            //validacao de email
            if(!usuario){
                req.flash('message', 'Não existe um usuário cadastrado com esse email.')
                return res.render('auth/esqueceuSenha')
            }
    
            //configuraçoes de token de senha do usuario
            const token = cripto.randomBytes(20).toString('hex')
            const now = new Date()
            now.setHours(now.getHours() + 1)
            usuario.passwordResetToken = token
            usuario.passwordResetExpires = now
            await UsuarioRepository.save(usuario)
    
            //configuracoes de envio de email
            let context = ``
            if(req.hostname == 'localhost' || req.hostname == '127.0.0.1'){
                context = `http://${req.hostname}:3000/redefinir-senha?token=${token}`
            }else{
                context = `https://${req.hostname}/redefinir-senha?token=${token}`
            }
            
            await mailer.sendMail({
                to: email,
                from: process.env.PROJECT_EMAIL,
                template: 'mailer/emailTemplate',
                context: {context}
            }, (err)=>{if(err){ console.log(err)} return})

            req.flash('message', 'Link de redefinição de senha, enviado ao seu email.')
            return res.render('auth/esqueceuSenha', {rota: req.session.rota})
    
        } catch (error) {
            console.log(error)
        }       
    }

    static redefinirSenha(req, res){
        const token = req.query.token
        if(!token){
            return res.redirect(`/entrar`)
        }
        return res.render('auth/redefinirSenha', {token})
    }

    static async redefinirSenhaPost(req, res){
        try {
            const {pwd, confirmpwd} = req.body
            const passwordResetToken = req.query.token

            if(!pwd || !confirmpwd){
                req.flash('message',  "preencha todos os campos")
                return res.render('auth/redefinirSenha', {token: passwordResetToken})
            }

            let usuario = await UsuarioRepository.findOneBy({passwordResetToken})
        
            //validacao de token
            if(!usuario){
                req.flash('message', 'Token invalido.')
                return res.render('auth/redefinirSenha', {token: 'invalido'}) 
            }

            //validacao de tempo
            const now = new Date()
            if(now > usuario.passwordResetExpires){
                req.flash('message', 'Token expirado.')
                return res.render('auth/redefinirSenha', {token: 'expirado'}) 
            }

            //validacao de senha
            if(pwd != confirmpwd){
                req.flash('message', 'Senhas não conferem.')
                return res.render('auth/redefinirSenha', {token: passwordResetToken})
            }

            //criptografia de senha
            const salt = bcrypt.genSaltSync(10)
            const hashedPwd = bcrypt.hashSync(pwd, salt)

            //salvar senha
            usuario.password = hashedPwd
            await UsuarioRepository.save(usuario)

            req.flash('message', `Senha redefinida.`) 
            return res.redirect(`/entrar`) 
        } catch (error) {
            console.log(error)
        }       
    }
    
    static async tokenValidacao(req, res, next){
        const token = req.session['token']
        jwt.verify(token, process.env.SECRET, (err, decoded) => {
            if(err) { return res.status(400).json({error: 'token expirado'}) }
        })
        
        return res.status(200).json({message: 'token validado'})
    }
}