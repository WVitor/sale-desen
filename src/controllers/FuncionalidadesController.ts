import { Like } from "typeorm"
import { FuncionalidadeRepository } from "../repositories/FuncionalidadeRepository"

export class FuncionalidadesController{
    static async funcionalidades(req, res){
        try {
            const page = req.params.page || 1
            let search = ''
           if(req.query.search){
               search = req.query.search
           }
 
            //
            const funcData = await FuncionalidadeRepository.find({ 
                select: {id: true, nome: true, url:true, nivel:true}, 
                where: [{nome: Like(`%${search}%`)},{url: Like(`%${search}%`) }], 
                order: {created_at: req.query.order ? req.query.order : "ASC"},
            })
            const funcionalidades = funcData.map((result)=>result).slice(page ? (10 * page) - 10 : 0, page ? 10 * page : 10)
            let paginacao = []
            let paginationLeft = parseInt(page)-1
            let paginationRight = parseInt(page)+1
            let contador = 0
            for(var i = 0; i <= funcData.map((result)=>result).length; i++){
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

            let emptyFunc = false
            if (funcionalidades.length === 0){
                emptyFunc = true
            }

            let funcQty = true
            if (funcionalidades.length === 0){
                funcQty = false
            }
            
            res.render('admin/funcDash', { funcionalidades, emptyFunc, search, funcQty, paginacao, paginationLeft, paginationRight, rota: req.session.rota})
        } catch (error) {
            console.log(error)
        }
    }

    static async cadastrarFuncionalidade(req, res){
        try {
            res.render('admin/funcRegister')
        } catch (error) {
            console.log(error)
        }
    }

    static async cadastrarFuncionalidadePost(req, res){
        try {
            let {nome, url, nivel} = req.body

            nome = nome.toLowerCase().split(" ").join("-")
            url = url.toLowerCase().split(" ").join("-")
            nivel = parseInt(req.body.nivel) 
    
            if(url.substr(0, 1) != '/'){
                url = "/".concat(url)
                console.log(url)
            }
    
            //validação de nome
            if(await FuncionalidadeRepository.findOneBy({nome: nome})){
                req.flash('message', 'Funcionalidade ja existe.')
                return res.render('admin/funcRegister')
            }
            //validação de url
            if(await FuncionalidadeRepository.findOneBy({url: url})){
                req.flash('message', 'Url ja existe.')
                return res.render('admin/funcRegister')
            }
            
            await FuncionalidadeRepository.save({nome, url, nivel})
            req.flash('message', 'Funcionalidade cadastrada com sucesso.')
            req.session.save(()=>{   
               return res.redirect(`/funcionalidades`)
            })
    
        } catch (error) {
            console.log(error)
        }
    }

    static async removerFuncionalidade(req, res){
        try {
            const {id} = req.body
            const funcionalidade = await FuncionalidadeRepository.findOneBy({id: id})
            await FuncionalidadeRepository.remove(funcionalidade)
            req.flash('message', 'Funcionalidade excluída com sucesso.')
            req.session.save(()=>{
              return res.redirect(`/funcionalidades`)
            })
        } catch (error) {
            console.log(error)
        }
    }
}