import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity({name: 'email'})
export class Email {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    to: string

    @Column()
    text: string

    @Column()
    from: string

    @Column()
    subject: string
}