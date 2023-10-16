import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class EmailDto {
    
    @IsString()
    text?: string

    @IsNotEmpty()
    @IsEmail()
    to?: string

    @IsNotEmpty()
    @IsString()
    html?: string

    @IsNotEmpty()
    @IsString()
    subject?: string

    @IsNotEmpty()
    @IsString()
    from?: string

}