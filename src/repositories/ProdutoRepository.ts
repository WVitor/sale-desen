import { Produto } from "../entity/Produto";
import { AppDataSource } from "../dao/data-source";
const moment = require('moment');
import { Between } from "typeorm";

export const ProdutoRepository = AppDataSource.getRepository(Produto).extend({
    planilhaData() {
        return ProdutoRepository.createQueryBuilder("produto")
            .where("produto.created_at >= :data", { data: moment().subtract(3, 'months').format("YYYY-MM-DD hh:mm:ss") })
            .select(["produto.codigo", "produto.nome", "produto.descricao", "produto.quantidade"])
            .getMany()
    },
    estoquePorMes(i: number){
        return ProdutoRepository.createQueryBuilder("produto")
            .where("produto.created_at >= :dataInicio", { dataInicio: moment().subtract(i, 'months').format("YYYY-MM-01 00:00:00") })
            .andWhere("produto.created_at <= :dataFinal", { dataFinal: moment().subtract(i, 'months').format("YYYY-MM-DD 23:59:59") })
            .select(["produto.codigo", "produto.nome", "produto.descricao", "produto.quantidade"])
            .getMany() 
    },
})