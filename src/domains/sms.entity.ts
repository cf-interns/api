import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "./application.entity";


@Entity({name: 'sms'})
export class Sms {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    message: string;

    @Column()
    status: string;

    @Column()
    provider: string

    @Column()
    sent_to: string;

    @Column()
    smsclientid: string;

    @Column({nullable: true})
    messageid: string;

    @Column()
    errorcode: string;

    @Column()
    errordescription: string;

    @CreateDateColumn()
    createdAt: string;

    @Column()
    totalSmsUnit: string;

    @Column()
    balance: string;
    
    @ManyToOne(() => Application, (author: Application) => author.sms)
    author?: Application

}