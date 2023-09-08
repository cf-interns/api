import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {

    @IsEmail()
    email: string;


    @IsNotEmpty()
    @MinLength(9)
    password: string
}