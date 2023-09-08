import { Column, CreateDateColumn, Entity, Generated, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";


@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    public _id: number;

    @Column()
    public appName: string;

    @Column({nullable: true})
    public status: string;

    @CreateDateColumn()
    public createdAt: Date;

    @Column()
    public description: string;

    @Column()
    @Generated('uuid')
    public token: string;

    @ManyToOne(() => User, (author: User) => author.apps)
    public author: User
}