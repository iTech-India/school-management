import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeacherAssignmentService } from './teacher-assignment.service';
import { TeacherAssignmentController } from './teacher-assignment.controller';
import { TeacherAssignment } from './entities/teacher-assignment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TeacherAssignment])],
  controllers: [TeacherAssignmentController],
  providers: [TeacherAssignmentService],
  exports: [TeacherAssignmentService],
})
export class TeacherAssignmentModule {}

