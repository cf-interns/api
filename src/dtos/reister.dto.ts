import { IsEmail } from "class-validator";

export class RegisterDataDto {
    // @IsEmail()
    firstName: string;

    lastName: string;

    email: string;

    password: string;
}