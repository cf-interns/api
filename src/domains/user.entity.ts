import { Column, CreateDateColumn, Entity, Generated, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Application } from "./application.entity";
import { Exclude } from "class-transformer";


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    public _id: string;

    @Column({ nullable: false })
    public firstName: string;

    @Column({ nullable: false })
    public lastName: string;

    @Column({ nullable: false })
    @Exclude()
    public password: string;

    @Column({ unique: true })
    public email: string;
    
/* 
    @Column({nullable: true})
    public token: string; */

    @Exclude()
    @Column({ nullable: true })
    public currentHashedRefreshToken: string;

    @OneToMany(() => Application, (app: Application) => app.author, {
        cascade: true
    })
    public apps?: Application[];

    // @Column()
    // @Generated('uuid')
    // api_key: string;

    //  @CreateDateColumn({ type: "timestamptz" })
    // usage: [{
    //     create_on: Date,
    //     count: 0
    // }]
    
}