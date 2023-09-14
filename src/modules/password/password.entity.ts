import { Column, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";



@Entity({name: 'password-reset'})
export class Password {

    @PrimaryGeneratedColumn()
    _id: number;

    @Column()
    mail: string;

    @Column()
    @Generated('uuid')
    token: string;
}