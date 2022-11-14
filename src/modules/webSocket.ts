import { Between } from "typeorm"
import { BaixaRepository } from "../repositories/BaixaRepository"
import { ProdutoRepository } from "../repositories/ProdutoRepository"
const moment = require('moment')
import { http } from '../../index'

const WebSocket = require('ws')

const wss = new WebSocket.Server({server: http, port: 3001, path:"/ws"});


export class SocketsController{
    static async graficoDashboard(){
        wss.on('connection', async function connection(ws) {
            console.log('A new client Connected!');
          
            const months = moment.monthsShort()
            let labels = []
            let entradas = []
            let baixas = []
        
            for(var i = 5; i>= 0; i--){        
                //entradas
                const countProduto = await ProdutoRepository.count({
                    where: { created_at: Between(moment().subtract(i, 'months').format("YYYY-MM-01 00:00:00"),
                    moment().subtract(i, 'months').format("YYYY-MM-30 23:59:59"))
                    }
                })
                entradas.push(countProduto)
        
                //baixas
                const countBaixas = await BaixaRepository.count({
                    where: { created_at: Between(
                            moment().subtract(i, 'months').format("YYYY-MM-01 00:00:00"),
                            moment().subtract(i, 'months').format("YYYY-MM-30 23:59:59")
                            )
                    }}
                )
                baixas.push(countBaixas)
        
                //labels
                labels.push(months[moment().subtract(i, 'months').format("M") - 1])
            }
            
            labels = labels.map((label)=>label)
            entradas = entradas.map((entrada)=>entrada)
            baixas = baixas.map((baixa)=>baixa)

            ws.send(JSON.stringify({labels, entradas, baixas}))
            return ws.close()
        });
        return
    }
}
