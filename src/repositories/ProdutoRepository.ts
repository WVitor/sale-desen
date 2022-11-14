import { Produto } from "../entity/Produto";
import { AppDataSource } from "../dao/data-source";
import moment = require('moment');

export const ProdutoRepository = AppDataSource.getRepository(Produto).extend({
    planilhaData() {
        return ProdutoRepository.createQueryBuilder("produto")
            .where("produto.created_at >= :data", { data: moment().subtract(3, 'months').format("YYYY-MM-DD hh:mm:ss") })
            .select(["produto.codigo", "produto.nome", "produto.descricao", "produto.quantidade"])
            .getMany()
    },
})