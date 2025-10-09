import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { User } from 'src/users/entities/user.entity';
import { Classes } from 'src/classes/entities/classes.entity';

@Module({
  imports : [TypeOrmModule.forFeature([Attendance,User,Classes])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
})
export class AttendanceModule {}
