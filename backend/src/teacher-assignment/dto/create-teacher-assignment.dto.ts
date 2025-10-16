import { IsUUID, IsBoolean, IsOptional } from 'class-validator';

export class CreateTeacherAssignmentDto {
  @IsUUID()
  teacherId: string;

  @IsUUID()
  classId: string;

  @IsUUID()
  subjectId: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

