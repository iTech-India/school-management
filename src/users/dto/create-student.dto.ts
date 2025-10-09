import { IsNotEmpty } from "class-validator";
import { BaseUserDto } from "./base-user.dto";


export class StudentCreateDto extends BaseUserDto {

  @IsNotEmpty()
  date_of_birth: Date;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  roll_no: string;
}