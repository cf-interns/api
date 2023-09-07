import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    public _id: string;

    @Column({nullable:  false})
    public firstName: string;

    @Column({nullable: false})
    public lastName: string;

/*     //TODO: Get FirstName
    @Column()
    public userName: string;
 */
    @Column({nullable: false})
    public password: string;

    @Column({unique: true})
    public email: string;
}