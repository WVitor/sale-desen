import { Funcionalidade } from '../entity/Funcionalidade'
import { TipoUsuario } from '../entity/Tipo_Usuario'
import { Usuario } from '../entity/Usuario'
import { FuncionalidadeRepository } from '../repositories/FuncionalidadeRepository'
import { TipoUsuarioRepository } from '../repositories/TipoUsuarioRepository'
import { UsuarioRepository } from '../repositories/UsuarioRepository'

const bcrypt = require('bcryptjs')
 
const Master = async (master : string)=>{
    let tipoUsuario = await TipoUsuarioRepository.findOneByMaster(master)
    const funcionalidades = await FuncionalidadeRepository.find()
    if(!tipoUsuario){
        tipoUsuario = await TipoUsuarioRepository.save({nome:master, nivel: 3})
    }
    if(tipoUsuario.funcionalidades == null || tipoUsuario.funcionalidades.length < funcionalidades.length){
        tipoUsuario.funcionalidades = funcionalidades
        await TipoUsuarioRepository.save(tipoUsuario)
    }

    let usuario = await UsuarioRepository.findOneBy({email: process.env.ADMIN_EMAIL})
    if(!usuario){
        const salt = bcrypt.genSaltSync(10)
        const pwd = bcrypt.hashSync(process.env.ADMIN_PWD, salt)
        usuario = await UsuarioRepository.save({nome: master, email: process.env.ADMIN_EMAIL, password: pwd, tipo: tipoUsuario})
    }
    return

}

module.exports = Master