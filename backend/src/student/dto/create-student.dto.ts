import { IsString, IsEmail, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateStudentDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  rollNumber: string;

  @IsString()
  phoneNumber: string;

  @IsString()
  @IsOptional()
  parentPhoneNumber?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @IsDateString()
  admissionDate: string;

  @IsUUID()
  @IsOptional()
  classId?: string;
}

