import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm"
import { TipoUsuario } from "./Tipo_Usuario"

@Entity()
export class Usuario {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    nome: string

    @Column()
    email: string

    @Column()
    password: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

    @Column({nullable: true})
    passwordResetToken: string;

    @Column({nullable: true})
    passwordResetExpires: Date;

    @ManyToOne(() => TipoUsuario, (tipo) => tipo.usuarios)
    tipo: TipoUsuario

}
