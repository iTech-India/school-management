import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class loginDto{
    @IsNotEmpty()
    email:string;

    @IsString()
    @MinLength(6)
    password:string
}