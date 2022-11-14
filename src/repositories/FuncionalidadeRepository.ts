import { AppDataSource } from "../dao/data-source";
import { Funcionalidade } from "../entity/Funcionalidade";

export const FuncionalidadeRepository = AppDataSource.getRepository(Funcionalidade).extend({

})