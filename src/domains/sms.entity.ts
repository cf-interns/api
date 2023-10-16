import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


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
    errorcode: number;

    @Column()
    errordescription: string;

    @Column()
    createdAt: string;

    @Column()
    totalSmsUnit: number;

    @Column()
    balance: number

}