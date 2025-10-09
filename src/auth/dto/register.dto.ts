import { IsNotEmpty, IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from 'src/users/enums/user-role';

export class RegisterDto {
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  firstName: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @IsEnum(UserRole, { message: 'Role must be admin, teacher, or student' })
  role: UserRole;
}
