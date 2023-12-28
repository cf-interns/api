import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";


export default class EmailDto {
    

    @ApiProperty()
    // @IsNotEmpty()
    @IsString()
    text?: string

    @ApiProperty()
    @IsArray()
    @IsString({each: true})
    @IsNotEmpty()
    // @IsEmail()
    to?: string

    @IsNotEmpty()
    // @IsString()
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
    @IsOptional()
    token?: string;

    @IsString()
    @IsOptional()
    _id?: string;

}