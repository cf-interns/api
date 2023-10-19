import { Column, CreateDateColumn, Entity, Generated, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Push } from "./pushNotification.entity";
import { Email } from "./email.entity";
import { Sms } from "./sms.entity";


@Entity()
export class Application {
    @PrimaryGeneratedColumn()
    public _id: string;

    @Column()
    public appName: string;

    @Column({ nullable: true })
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

    @OneToMany(() => Push, (push: Push) => push.author)
    push?: Push[]

    @OneToMany(() => Email, (email: Email) => email.author)
    email?: Email[]

    @OneToMany(() => Sms, (sms: Sms) => sms.author)
    sms?: Sms[]
}