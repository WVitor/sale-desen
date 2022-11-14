
import { Like, Not } from "typeorm";
import { AppDataSource } from "../dao/data-source";
import { TipoUsuario } from "../entity/Tipo_Usuario";

export const TipoUsuarioRepository = AppDataSource.getRepository(TipoUsuario).extend({
    findOneByMaster(master: string) {
        return TipoUsuarioRepository.createQueryBuilder("tipo_usuario")
            .where("tipo_usuario.nome = :master", { master })
            .leftJoinAndSelect("tipo_usuario.funcionalidades", "funcionalidade")
            .select(["tipo_usuario.id", "tipo_usuario.nome"])
            .addSelect(["funcionalidade.id", "funcionalidade.nome", "funcionalidade.url"])
            .getOne()
    },
    findForUserRegister(){
        return TipoUsuarioRepository.find({
            select: {id:true, nome: true}, 
            where: {nome: Not(Like(`${process.env.ADMIN}`))}})  
    }

})