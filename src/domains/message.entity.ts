import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'messages'})
export class Message {

    @PrimaryGeneratedColumn('uuid')
    _id: string

    @Column({nullable: true})
    message?: string

    @CreateDateColumn()
    created_at: Date

    @Column({nullable: true})
    text?: string

    @Column({nullable: true})
    to?: string

    @Column({nullable: true})
    subject?: string

    @Column({nullable: true})
    from?: string
    
    @Column({nullable: true})
    body?: string

    @Column({nullable: true})
    title?: string

    @Column({nullable: true})
    icon?: string 
    

    @Column({nullable: true})
    token?: string 


    

}