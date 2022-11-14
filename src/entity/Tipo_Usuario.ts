import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToMany, OneToMany, JoinTable } from "typeorm"
import { Funcionalidade } from "./Funcionalidade"
import { Usuario } from "./Usuario"
@Entity()
export class TipoUsuario {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: string

    @Column()
    nivel: number

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @OneToMany(() => Usuario, (usuario) => usuario.tipo)
    usuarios: Usuario[]

    @ManyToMany(() => Funcionalidade, (funcionalidades) => funcionalidades.tiposUsuarios)
    @JoinTable()
    funcionalidades: Funcionalidade[]
    
}