import { IsEmail, IsNotEmpty, IsString, Length, Min, MinLength } from "class-validator";


export class BaseUserDto {

    @IsEmail()
    email : string;

    @IsNotEmpty()
    @MinLength(3)
    firstName : string;

    lastName? : string;

}


