import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export default class EmailDto {
    

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    text?: string

    @ApiProperty()
    @IsNotEmpty()
    @IsEmail()
    to?: string

    @ApiProperty()
    html?: string 

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    subject?: string

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    from?: string;

    @IsString()
    token?: string;

    @IsString()
    _id?: string;

}