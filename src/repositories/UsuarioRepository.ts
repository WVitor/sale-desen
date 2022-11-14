import { Usuario } from "../entity/Usuario";
import { AppDataSource } from "../dao/data-source";

export const UsuarioRepository = AppDataSource.getRepository(Usuario).extend({
    findAllNotMaster() {
        return UsuarioRepository.createQueryBuilder('usuario')
        .leftJoinAndSelect("usuario.tipo", "tipo_usuario")   
        .leftJoinAndSelect("tipo_usuario.funcionalidades", "funcionalidade")
        .select(["usuario.id", "usuario.nome", "usuario.email", "usuario.created_at"])
        .addSelect(['tipo_usuario.id', 'tipo_usuario.nome', "tipo_usuario.nivel"])
        .addSelect(["funcionalidade.id", "funcionalidade.nome", "funcionalidade.nivel"])
        .where('tipo_usuario.nome != :nome', { nome: process.env.ADMIN })
        .getMany()
    },
    findOneByIdNotMaster(id: number) {
        return UsuarioRepository.createQueryBuilder('usuario')
        .leftJoinAndSelect("usuario.tipo", "tipo_usuario")   
        .leftJoinAndSelect("tipo_usuario.funcionalidades", "funcionalidade")
        .select(["usuario.id", "usuario.nome", "usuario.email", "usuario.created_at"])
        .addSelect(['tipo_usuario.id', 'tipo_usuario.nome', "tipo_usuario.nivel"])
        .addSelect(["funcionalidade.id", "funcionalidade.nome", "funcionalidade.nivel"])
        .where('tipo_usuario.nome != :nome', { nome: process.env.ADMIN })
        .andWhere('usuario.id = :id', {id:id})
        .getOne()
    },
    acharPorEmailJuntarTipo(email: string) {
        return UsuarioRepository.createQueryBuilder('usuario')
        .leftJoinAndSelect("usuario.tipo", "tipo_usuario")   
        .select(["usuario.id", "usuario.nome", "usuario.email", "usuario.password"])
        .addSelect(['tipo_usuario.id', 'tipo_usuario.nome', "tipo_usuario.nivel"])
        .where('usuario.email = :email', { email: email })
        .getOne()
    },
})