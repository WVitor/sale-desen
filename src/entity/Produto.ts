import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from "typeorm"

@Entity()
export class Produto {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    codigo: string

    @Column()
    nome: string

    @Column({nullable: true})
    descricao: string

    @Column()
    quantidade: number

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    public created_at: Date;

}