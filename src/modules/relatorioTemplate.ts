import PdfPrinter = require("pdfmake")
import { TDocumentDefinitions } from "pdfmake/interfaces"
import { BaixaRepository } from "../repositories/BaixaRepository"
import { ProdutoRepository } from "../repositories/ProdutoRepository"
const moment = require('moment')


export class RelatoriosController{
    static async relatorioTrimestral(req, res){
        let entradasMesAtual = []
        let entradasMesPassado = []
        let entradasMesRetrasado = []
        let baixasMesAtual = []
        let baixasMesPassado = []
        let baixasMesRestrasado = []
        const months = moment.localeData("pt").months()
        let meses = []
        for (var i = 0; i<= 2; i++){
            const produtos = await ProdutoRepository.estoquePorMes(i)   
            const baixas = await BaixaRepository.estoquePorMes(i)
            meses.push(months[moment().subtract(i, 'months').format("MM") - 1].toUpperCase())
            if(i == 0){
                //entradas
                if(produtos.length !== 0){
                    entradasMesAtual = [Object.keys(produtos[0]).map(k=>{return{text:k, style: "columnsTitle"}})]
                    produtos.map(produto=>{ 
                        entradasMesAtual.push(Object.values(produto).map(v => v))
                    })
                }else{
                    entradasMesAtual = [[{text: "Não existe estoque referente a esse mes.", style: "columnsTitle"}]]
                }
                //baixas
                if(baixas.length !== 0){
                    baixasMesAtual = [Object.keys(baixas[0]).map(k=>{return{text:k, style: "columnsTitle"}})]
                    baixas.map(baixa=>{ 
                        baixasMesAtual.push(Object.values(baixa).map(v => v))
                    })
                }else{
                    baixasMesAtual = [[{text: "Não existe baixas referente a esse mes.", style: "columnsTitle"}]]
                }
            }
            else if(i == 1){
                if(produtos.length !== 0){
                    entradasMesPassado = [Object.keys(produtos[0]).map(k=>{return{text:k, style: "columnsTitle"}})]
                    produtos.map(produto=>{ 
                        entradasMesPassado.push(Object.values(produto).map(v => v))
                    })
                }else{
                    entradasMesPassado = [[{text: "Não existe estoque referente a esse mes.", style: "columnsTitle"}]]
                }
                //baixas
                if(baixas.length !== 0){
                    baixasMesPassado = [Object.keys(baixas[0]).map(k=>{return{text:k, style: "columnsTitle"}})]
                    baixas.map(baixa=>{ 
                        baixasMesPassado.push(Object.values(baixa).map(v => v))
                    })
                }else{
                    baixasMesPassado = [[{text: "Não existe baixas referente a esse mes.", style: "columnsTitle"}]]
                }
            }
            else if(i == 2){
                if(produtos.length !== 0){
                    entradasMesRetrasado = [Object.keys(produtos[0]).map(k=>{return{text:k, style: "columnsTitle"}})]
                    produtos.map(produto=>{ 
                        entradasMesRetrasado.push(Object.values(produto).map(v => v))
                    })
                }else{
                    entradasMesRetrasado = [[{text: "Não existe estoque referente a esse mes.", style: "columnsTitle"}]]
                }
                //baixas
                if(baixas.length !== 0){
                    baixasMesRestrasado = [Object.keys(baixas[0]).map(k=>{return{text:k, style: "columnsTitle"}})]
                    baixas.map(baixa=>{ 
                        baixasMesRestrasado.push(Object.values(baixa).map(v => v))
                    })
                }else{
                    baixasMesRestrasado = [[{text: "Não existe baixas referente a esse mes.", style: "columnsTitle"}]]
                }
            }
        }
        const docDefinitions : TDocumentDefinitions = {
            defaultStyle: {font: 'Helvetica'},
            content: [
                {
                    image: `${__dirname}/../../public/img/sale_logo.png`,
                    alignment: "center"
                },"\n",
                {
                    text: `Sistema admistrativo e logistico de estoque (SALE)`,
                    style: "header"
                },
                {
                    columns: [
                        {
                            text: `Relatorio trimestral de estoque.`,
                            fontSize: 12,
                            bold: true,
                            alignment: "center"
                        },
                        {   
                            text: `Relatorio gerado ${moment().format('DD/MM/YYYY')}.`,
                            fontSize: 12,
                            bold: true,
                            alignment: "center",
                        }
                        
                    ]
                },'\n\n',
                {
                    text: `Entradas\n__________________________________________________________________`,
                    bold: true,
                    fontSize: 14,
                    color: "#222",
                    alignment: "center",
                },"\n",
                {
                    text: `Relação de produtos referente ao mes de ${meses[0]}.`,
                    alignment: "center"
                },'\n',              
                {    
                    columns:[
                        { width: '*', text: ''},
                        { width: "auto", 
                            table:{      
                                heights: function(row){ return 25}, 
                                body: [...entradasMesAtual]         
                            }, 
                        },
                        { width: '*', text: '' },
                    ]
                },'\n\n',
                {
                    text: `Relação de produtos referente ao mes de ${meses[1]}.`,
                    alignment: "center"
                },'\n',
                {
                    columns:[
                        { width: '*', text: '' },
                        { width: "auto", 
                            table:{
                                heights: function(row){ return 25}, 
                                body: [...entradasMesPassado]
                            }, 
                        },
                        { width: '*', text: '' },
                    ]
                },'\n\n',
                {
                    text: `Relação de produtos referente ao mes de ${meses[2]}.`,
                    alignment: "center"
                },'\n',
                {
                    columns:[
                        { width: '*', text: '' },
                        { width: "auto", 
                            table: {
                                heights: function(row){ return 25}, 
                                body: [...entradasMesRetrasado]
                            }, 
                        },
                        { width: '*', text: '' },
                    ]
                },'\n\n',
                {
                    text: `Baixas\n__________________________________________________________________`,
                    bold: true,
                    fontSize: 14,
                    color: "#222",
                    alignment: "center",
                },"\n",
                {
                    text: `Relação de Baixas referente ao mes de ${meses[0]}.`,
                    alignment: "center"
                },'\n',
                {
                    columns:[
                        { width: '*', text: '' },
                        { width: "auto", 
                            table: {
                                heights: function(row){ return 25}, 
                                body: [...baixasMesAtual]
                            }, 
                        },
                        { width: '*', text: '' },
                    ]
    
                },'\n\n',
                {
                    text: `Relação de Baixas referente ao mes de ${meses[1]}.`,
                    alignment: "center"
                },'\n',
                {
                    columns:[
                        { width: '*', text: '' },
                        { width: "auto", 
                            table: {
                                heights: function(row){ return 25}, 
                                body: [...baixasMesPassado]
                            }, 
                        },
                        { width: '*', text: '' },
                    ]
    
                },'\n\n',
                {
                    text: `Relação de Baixas referente ao mes de ${meses[2]}.`,
                    alignment: "center"
                },'\n',
                {
                    columns:[
                        { width: '*', text: '' },
                        { width: "auto", 
                            table: {
                                heights: function(row){ return 25}, 
                                body: [...baixasMesRestrasado]
                            }, 
                        },
                        { width: '*', text: '' },
                    ]
                },
            ],
            styles: {
                columnsTitle: {
                    fontSize: 14,
                    bold: true,
                    fillColor: "#222",
                    color: "#f6982d",
                    alignment: "center",
                    margin: 4
                },
                header: {
                    fontSize: 16,
                    bold: true,
                    alignment: 'center'
                }
            }
        }
        const fonts = {
            Helvetica: {
              normal: 'Helvetica',
              bold: 'Helvetica-Bold',
              italics: 'Helvetica-Oblique',
              bolditalics: 'Helvetica-BoldOblique'
            }
        };
    
        const pdfDoc = new PdfPrinter(fonts).createPdfKitDocument(docDefinitions)
        const chunks = []
        pdfDoc.on('data', (chunk)=>{
            chunks.push(chunk)
        })
        pdfDoc.end()
        pdfDoc.on('end', ()=>{
            const relatorio = Buffer.concat(chunks)
            return res.end(relatorio)
        })
    }
}