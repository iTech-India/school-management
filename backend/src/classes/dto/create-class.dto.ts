import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateClassDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  section?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

