import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "./application.entity";


@Entity({name: 'email'})
export class Email {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    to: string

    @Column()
    text: string

    @Column()
    from: string

    @Column()
    subject: string

    @CreateDateColumn()
    sent_at: string

    @ManyToOne(() => Application, (author: Application) => author.email)
    author?: Application
}