import { IsEmail, IsNotEmpty } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    public _id: string;

    @Column()
    @IsNotEmpty()
    public firstName: string;

    @Column()
    @IsNotEmpty()
    public lastName: string;

/*     //TODO: Get FirstName
    @Column()
    public userName: string;
 */
    @Column()
    @IsNotEmpty()
    public password: string;

    @Column({unique: true})
    @IsEmail()
    public email: string;
}