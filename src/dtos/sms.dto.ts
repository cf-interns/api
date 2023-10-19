import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class smsDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    message: string


    @ApiProperty()
    @IsNotEmpty()
    mobiles: string
}