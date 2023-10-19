import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "./application.entity";


@Entity({name: 'Push'})
export class Push {

    @PrimaryGeneratedColumn('uuid')
     public _id: string

    @Column()
    public title: string

    @Column()
    public body: string

    @Column({nullable: true})
    public icon: string | null

    @CreateDateColumn()
     public sent_at: string
    
    @ManyToOne(() => Application, (author: Application) => author.push)
     public author: Application
}