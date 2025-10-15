import { IsUUID, IsEnum, IsDateString, IsString, IsOptional } from 'class-validator';
import { AttendanceStatus } from '../enums/attendance-status.enum';

export class CreateAttendanceDto {
  @IsUUID()
  studentId: string;

  @IsUUID()
  classId: string;

  @IsDateString()
  date: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsString()
  @IsOptional()
  remarks?: string;
}

