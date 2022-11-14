import { LessThan, LessThanOrEqual, Like, Not } from "typeorm";
import { FuncionalidadeRepository } from "../repositories/FuncionalidadeRepository";
import { TipoUsuarioRepository } from "../repositories/TipoUsuarioRepository";

export class TipoUsuarioController{
    static async tiposUsuario(req, res){
        try {
            const page = req.params.page || 1
            let search = ''
            if(req.query.search){
                search = req.query.search
            }

            //
            const tiposUsuario = await TipoUsuarioRepository.find({
                select: {id: true, nome: true, nivel:true}, 
                where: {nome: Like(`%${search}%`) && Not(Like(`${process.env.ADMIN}`))},
                order: {created_at: req.query.order ? req.query.order : "ASC"},
            })
            const tipos = tiposUsuario.map((result)=>result).slice(page ? (10 * page) - 10 : 0, page ? 10 * page : 10)
            let paginacao = []
            let paginationLeft = parseInt(page)-1
            let paginationRight = parseInt(page)+1
            let contador = 0
            for(var i = 0; i <= tiposUsuario.map((result)=>result).length; i++){
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

            let emptyTypes = false
            if (tipos.length === 0){
                emptyTypes = true
            }

            let typesQty = true
            if (tipos.length === 0){
                typesQty = false
            }
            
           return res.render('admin/typeDash', { tipos, emptyTypes, search, typesQty, paginacao, paginationLeft, paginationRight})

        } catch (error) {
            console.log(error)
        }
    }
 
    static async cadastrarTipoUsuario(req, res){
        try {
           return res.render('admin/typeRegister')
        } catch (error) {
            console.log(error)
        }
    }

    static async cadastrarTipoUsuarioPost(req, res){
        try {
            const {nome, nivel} = req.body
            //validação de tipo
            if(await TipoUsuarioRepository.findOneBy({nome: nome})){
                req.flash('message', 'Ja existe um tipo de usuario com esse nome.')
                return res.render('admin/typeRegister')
            }
    
            await TipoUsuarioRepository.save({nome:nome, nivel:nivel})
            //salvar e manter sessao
            req.flash('message', 'Tipo criado com sucesso')
            req.session.save(()=>{   
                res.redirect(`/tipos-usuario`)
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async removerTipoUsuario(req, res){
        try {
            const {id} = req.body
            const tipoUsuario = await TipoUsuarioRepository.findOne({
                relations: {usuarios: true},
                where: {id:id}
            })
            if(tipoUsuario.usuarios.length > 0){              
                req.flash('message', 'Existe usuários cadastrados para esse tipo.')
                return res.redirect(`/tipos-usuario`)
            }
            await TipoUsuarioRepository.remove(tipoUsuario)
            req.flash('message', 'Excluido com sucesso.')
            req.session.save(()=>{
                res.redirect(`/tipos-usuario`)
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async permissoes(req, res){

        const tipo = req.params.tipo
        const tipoUsuario = await TipoUsuarioRepository.findOne({
            select: {id: true, nome:true, nivel:true, funcionalidades: {id: true, nome: true}},
            relations: {funcionalidades: true},
            where:{nome:tipo}
        })

        const funcionalidades = await FuncionalidadeRepository.find({ 
            select: {id: true, nome: true},
            where: {nivel: LessThanOrEqual(tipoUsuario.nivel)}
        })

        let tipoFuncionalidades = tipoUsuario.funcionalidades.map((result)=>{
            const find = funcionalidades.find(element=> element.id == result.id)
            if(find){
                funcionalidades.splice(funcionalidades.indexOf(find), 1)
            }
            return result
        })

        return res.render('admin/permissoes', {typeId: tipoUsuario.id, funcionalidades, tipoFuncionalidades})
    }
    
    static async permissoesPost(req, res){
        const {id, ...data} = req.body
        
        const tipoUsuario = await TipoUsuarioRepository.findOne({
            relations: {funcionalidades: true},
            where:{id:id}
        })
        
        tipoUsuario.funcionalidades = []
        Object.keys(data).map(async(i) => {
            const funcionalidade = await FuncionalidadeRepository.findOne({
                select: {id: true},
                where:{id: parseInt(data[i])}
            })
            tipoUsuario.funcionalidades.push(funcionalidade)
        })

        await TipoUsuarioRepository.save(tipoUsuario)
        req.flash('message', 'Permissões concedidas com sucesso')
        req.session.save(()=>{   
            res.redirect(`/tipos-usuario`)
        })
    }

}