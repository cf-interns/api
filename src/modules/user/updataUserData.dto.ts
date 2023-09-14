import { IsNotEmpty, MinLength } from "class-validator";


export class updateUserPassword {

    @IsNotEmpty()
    @MinLength(9)
    password: string
}