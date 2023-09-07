import { Column, CreateDateColumn, Entity, Generated, PrimaryGeneratedColumn } from "typeorm";


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
}