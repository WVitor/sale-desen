import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { TipoUsuario } from "./Tipo_Usuario"
@Entity()
export class Funcionalidade {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: string

    @Column()
    url: string

    @Column()
    nivel: number

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @ManyToMany(() => TipoUsuario, (tiposUsuario) => tiposUsuario.funcionalidades)
    tiposUsuarios: TipoUsuario[]
}