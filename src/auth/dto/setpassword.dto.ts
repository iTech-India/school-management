import { IsString, MinLength } from "class-validator";

export class setPasswordDto{
    @IsString()
    @MinLength(6)
    password:string;
    
    @IsString()
    confirmPassword:string
}