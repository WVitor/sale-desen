import { Baixa } from "../entity/Baixa";
import { AppDataSource } from "../dao/data-source";

export const BaixaRepository = AppDataSource.getRepository(Baixa).extend({

})