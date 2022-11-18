import { Baixa } from "../entity/Baixa";
import { AppDataSource } from "../dao/data-source";
const moment = require('moment')

export const BaixaRepository = AppDataSource.getRepository(Baixa).extend({
    estoquePorMes(i: number){
        return BaixaRepository.createQueryBuilder("baixa")
            .where("baixa.created_at >= :dataInicio", { dataInicio: moment().subtract(i, 'months').format("YYYY-MM-01 00:00:00") })
            .andWhere("baixa.created_at <= :dataFinal", { dataFinal: moment().subtract(i, 'months').format("YYYY-MM-DD 23:59:59") })
            .select(["baixa.codigo"])
            .getMany() 
    },
})