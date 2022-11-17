import { Like } from "typeorm"
import { SocketsController } from "../modules/webSocket"
import { BaixaRepository } from "../repositories/BaixaRepository"
import { ProdutoRepository } from "../repositories/ProdutoRepository"
import moment = require('moment');
import otc = require('objects-to-csv')
import fs = require('fs')
import path = require('path')
import PdfPrinter = require("pdfmake");
import { TableCell, TDocumentDefinitions } from "pdfmake/interfaces";
import { table } from "console";

export class ProdutosController{

    static async dashboard(req, res){
        try {
            SocketsController.graficoDashboard()
            res.render('produtos/home')
        } catch (error) {
            console.log(error)
        }
    } 

    static async estoque(req, res){
        try {
            const page = req.params.page || 1
            let search = ''
            if(req.query.search){
                search = req.query.search
            }
     
            const produtosData = await ProdutoRepository.find({ 
                where: {nome: Like(`%${search}%`)},    
                order: {created_at: req.query.order ? req.query.order : "ASC"},
            })

            const produtos = produtosData.map((result)=>result).slice(page ? (10 * page) - 10 : 0, page ? 10 * page : 10)
            let paginacao = []
            let paginationLeft = parseInt(page)-1
            let paginationRight = parseInt(page)+1
            let contador = 0
            for(var i = 0; i <= produtosData.map(result=>result).length; i++){
                if(i > 10 * contador){
                    contador++
                    paginacao.push(contador)
                }
            }
            if(paginationLeft === 0 || page === undefined){
                paginationLeft = 1
            }
            if(paginationRight > contador ){
                paginationRight = contador
            }

            let emptyProdutos = false
            if (produtos.length === 0){
                emptyProdutos = true
            }

            let produtosQty = true
            if (produtos.length === 0){
                produtosQty = false
            }
            
            return res.render('produtos/estoque', {Data: moment().format("DD-MM-YYYY"), produtos, emptyProdutos, search, produtosQty, paginacao, paginationLeft, paginationRight})
        } catch (error) {
            console.log(error)
        }
    }

    static cadastrarProduto(req, res){
        return res.render('produtos/create')
    }

    static async cadastrarProdutoPost(req, res){
        try {
            const {nome, descricao, quantidade} = req.body
            const produto = {
                nome,
                codigo: nome.substr(0, 2).concat((Math.floor(Math.random() * (99999999 - 10000000) + 10000000))),
                descricao,
                quantidade
            }
            //salvar
            await ProdutoRepository.save(produto)
            req.flash('message', 'Produto criado com sucesso')
            req.session.save(()=>{
               return res.redirect(`/estoque`)
            })  

        } catch (error) {
            console.log(error)
        }
    }

    static async baixaProduto(req, res){
        try {
            const {id} = req.body
            const produto = await ProdutoRepository.findOneBy({id: id})
            await BaixaRepository.save({codigo: produto.codigo})
            await ProdutoRepository.remove(produto)
            req.flash('message', 'Baixa com sucesso.')
            req.session.save(()=>{
                return res.redirect(`/estoque`)
            })
        } catch (error) {
            console.log(error)
        }      
    }

    static async removerProduto(req, res){
        try {
            const {id} = req.body
            const produto = await ProdutoRepository.findOneBy({id: id})
            await ProdutoRepository.remove(produto)
            req.flash('message', 'Produto excluido com sucesso.')
            req.session.save(()=>{
                return res.redirect(`/estoque`)
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async editarProduto(req, res){
        try {
            const produtoId = req.params.id
            const produto = await ProdutoRepository.findOneBy({id: produtoId})
            if(!produtoId || !produto){
                return res.redirect('/estoque')
            }
            return res.render('produtos/edit', {produto: produto})
        } catch (error) {
            console.log(error)
        }
    }

    static async editarProdutoPost(req, res){
        try {
            const {id, nome, descricao, quantidade} = req.body
            const produto = await ProdutoRepository.findOneBy({id:id})
            produto.nome = nome
            produto.descricao = descricao
            produto.quantidade = quantidade
            await ProdutoRepository.save(produto)
            req.flash('message',  "Produto alterado com sucesso.")
            req.session.save(()=>{
                return res.redirect(`/estoque`)
            })
        } catch (error) {
            console.log(error)
        }
    }

    static async exportarPlanilha(req, res){
        try {
            const produtos = await ProdutoRepository.planilhaData()        
            const csv = new otc(produtos)
            const tmpDir = path.join(require('os').tmpdir(), 'sale/files')
            if(!fs.existsSync(tmpDir)){
                fs.mkdirSync(tmpDir)
            }
            await csv.toDisk(`${tmpDir}/Planilha-${moment().format("DD-MM-YYYY")}.csv`)
            res.download(`${tmpDir}/Planilha-${moment().format("DD-MM-YYYY")}.csv`)
            fs.rm(`${tmpDir}/Planilha-${moment().format("DD-MM-YYYY")}.csv`, (err)=>{if(err){console.log(err)}})
        } catch (error) {
            console.log(error)
        }
    }

    static async exportarRelatorio(req, res){
        try {
            let entradasMesAtual = []
            let entradasMesPassado = []
            let entradasMesRetrasado = []
            for (var i = 0; i<= 2; i++){
                const produtos = await ProdutoRepository.estoquePorMes(i)   
                if(produtos.length !== 0){
                    if(i == 0){
                        entradasMesAtual = [Object.keys(produtos[0]).map(k=>{return{text:k, style: "columnsTitle"}})]
                        produtos.map(produto=>{ 
                            entradasMesAtual.push(Object.values(produto).map(v => v))
                        })
                    }
                    else if(i == 1){
                        entradasMesPassado = [Object.keys(produtos[0]).map(k=>{return{text:k, style: "columnsTitle"}})]
                        produtos.map(produto=>{ 
                            entradasMesPassado.push(Object.values(produto).map(v => v))
                        })
                    }
                    else if(i == 2){
                        entradasMesRetrasado = [Object.keys(produtos[0]).map(k=>{return{text:k, style: "columnsTitle"}})]
                        produtos.map(produto=>{ 
                            entradasMesRetrasado.push(Object.values(produto).map(v => v))
                        })
                    }
                }
            }
            console.log(entradasMesAtual)
            console.log(entradasMesPassado)
            console.log(entradasMesRetrasado)
            //const baixas = await ProdutoRepository.planilhaData() 

            const fonts = {
                Helvetica: {
                  normal: 'Helvetica',
                  bold: 'Helvetica-Bold',
                  italics: 'Helvetica-Oblique',
                  bolditalics: 'Helvetica-BoldOblique'
                }
              };
    
            const docDefinitions : TDocumentDefinitions = {
                defaultStyle: {font: 'Helvetica'},
                content: [
                    entradasMesAtual.length !== 0 ? 
                    {      
                        table:{
                            body: [...entradasMesAtual]
                        } 
                    }:
                    {
                        text: "Não existe produtos cadastrados no respectivo mes"
                    }
                ],
                styles: {
                    columnsTitle: {
                        fontSize: 13,
                        bold: true,
                        fillColor: "#222",
                        color: "#f6982d",
                        alignment: "center",
                        margin: 4
                    }
                }
            }

            const pdfDoc = new PdfPrinter(fonts).createPdfKitDocument(docDefinitions)
            const chunks = []
            pdfDoc.on('data', (chunk)=>{
                chunks.push(chunk)
            })
            pdfDoc.end()
            pdfDoc.on('end', ()=>{
                const relatorio = Buffer.concat(chunks)
                res.end(relatorio)
            })

        } catch (error) {
            console.log(error)
        }
    }
}