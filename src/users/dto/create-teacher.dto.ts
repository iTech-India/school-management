import { PartialType } from '@nestjs/mapped-types';
import { BaseUserDto } from './base-user.dto';
import { IsNotEmpty } from 'class-validator';


export class CreateTeacherDto extends BaseUserDto{

    @IsNotEmpty()
    phoneNumber : string;

    @IsNotEmpty()
    hire_date : string;
}