import { Like, Not } from "typeorm";
import { TipoUsuarioRepository } from "../repositories/TipoUsuarioRepository";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
const cripto = require('crypto')
const bcrypt = require('bcryptjs')

export class UsuarioController{

    static async administrador(req, res){
        try {
            return res.render('admin/admin')
        } catch (error) {
            console.log(error)
        }
    } 
    
    static async usuarios(req, res){
        try {
            const page = req.params.page || 1
            let search = ''
            if(req.query.search){
                search = req.query.search
            }
            //
            const usuariosData = await UsuarioRepository.find({ 
                select: {id: true, nome: true, email:true, created_at:true, tipo:{nome:true}},
                relations: {tipo: true},
                where: [{nome: Like(`%${search}%`), id: Not(req.session["userId"])},
                {email: Like(`%${search}%`), id: Not(req.session["userId"])}], 
                order: {created_at: req.query.order},

            })
            const usuarios = usuariosData.map((result)=>result).slice(page ? (10 * page) - 10 : 0, page ? 10 * page : 10)
            let paginacao = []
            let paginationLeft = parseInt(page)-1
            let paginationRight = parseInt(page)+1
            let contador = 0
            for(var i = 0; i <= usuariosData.map(result=>result).length; i++){
                if(i > 10 * contador){
                    contador++
                    paginacao.push(contador)
                }
            }
            if(paginationLeft === 0 || page === undefined){
                paginationLeft = 1
            }
            if(paginationRight > contador){
                paginationRight = contador
            }

            let emptyUsers = false
            if (usuarios.length === 0){
                emptyUsers = true
            }

            let usersQty = true
            if (usuarios.length === 0){
                usersQty = false
            }
            
            return res.render('admin/userDash', { usuarios, emptyUsers, search, usersQty, paginacao, paginationLeft, paginationRight})
        } catch (error) {
            console.log(error)
        }
    }

    static async cadastrarUsuario(req, res){
        try {
            const tiposUsuario = await TipoUsuarioRepository.findForUserRegister()
            const tipos = tiposUsuario.map((result)=>result)
            return res.render('admin/userRegister', {tipos})
        } catch (error) {
            console.log(error)
        }
    }

    static async cadastrarUsuarioPost(req, res){
        try {
            const {nome, email, tipoId} = req.body
            const tipo = await TipoUsuarioRepository.findOne({where: {nome: Not(Like(`${process.env.ADMIN}`)), id: tipoId}})
            if(!tipo){
                const userTypes = await TipoUsuarioRepository.findForUserRegister()
                const tipos = userTypes.map((result)=>result)
                req.flash('message', 'Cadastre um tipo de usuário para continuar.')
                return res.render('admin/userRegister', {tipos})
            }
            //validacao de email
            if(await UsuarioRepository.findOneBy({email: email})){
                const userTypes = await TipoUsuarioRepository.findForUserRegister()
                const tipos = userTypes.map((result)=>result)
                req.flash('message', 'Ja existe um usuario com esse email.')
                return res.render('admin/userRegister', {tipos})
            }
    
            //gerar e criptografar de senha
            const pwd = cripto.randomBytes(10).toString('hex')
            const salt = bcrypt.genSaltSync(10)
            const hashedPwd = bcrypt.hashSync(pwd, salt)
            
            const usuario = {
                nome,
                email,
                password : hashedPwd,
                tipo
            }
    
            await UsuarioRepository.save(usuario)
            //salvar e manter sessao
            req.flash('message', 'Usuario criado com sucesso')
            req.session.save(()=>{   
                res.redirect(`/usuarios`)
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async removerUsuario(req, res){
        try {
            const id = req.body.id
            const usuario = await UsuarioRepository.findOneBy({id:id})
            await UsuarioRepository.remove(usuario)
            req.flash('message', 'Excluido com sucesso.')
            req.session.save(()=>{
                res.redirect(`/usuarios`)
            })  
        } catch (error) {
            console.log(error)
        }
    }
}