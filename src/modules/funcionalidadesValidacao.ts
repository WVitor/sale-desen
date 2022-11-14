import { Like } from "typeorm"
import { FuncionalidadeRepository } from "../repositories/FuncionalidadeRepository"
import { UsuarioRepository } from "../repositories/UsuarioRepository"

exports.funcionalidadesValidacao = async (req, res, next) =>{
    try {
        const url = req.url.split("/")[1].split("?")[0]
        const usuario = await UsuarioRepository.findOne({
            select: {id: true, tipo:{id: true, nome: true, funcionalidades: {id: true, nome: true, url: true}}},
            relations: {tipo: { funcionalidades: true}},
            where: {id: req.session.userId}
        })
        
        if(usuario.tipo.nome == process.env.ADMIN){
           return next()
        }

        const funcionalidade = await FuncionalidadeRepository.findOne({where: {url: Like(`/${url}%`)}})
        if(!funcionalidade){
            req.flash('message', 'Funcionalidade não encontrada.')
            req.session.save(()=>{
               return res.redirect(`/dashboard`)
            })
        }

        const permissao = Array.isArray(usuario.tipo.funcionalidades) ? usuario.tipo.funcionalidades.map((result)=>result.nome) : []
        if(permissao.indexOf(funcionalidade.nome) == -1 && !permissao.find((element)=>element === funcionalidade.nome)){     
            req.flash('message', 'Usuário sem autorização para acessar essa funcionalidade.')
            return res.redirect(`/dashboard`)        
        }
        
        return next()

    } catch (error) {
        console.log(error)
    }
}