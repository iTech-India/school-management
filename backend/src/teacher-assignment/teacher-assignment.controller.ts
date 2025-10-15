import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TeacherAssignmentService } from './teacher-assignment.service';
import { CreateTeacherAssignmentDto } from './dto/create-teacher-assignment.dto';
import { UpdateTeacherAssignmentDto } from './dto/update-teacher-assignment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/enums/user-role.enum';

@Controller('teacher-assignments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TeacherAssignmentController {
  constructor(private readonly assignmentService: TeacherAssignmentService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  create(@Body() createAssignmentDto: CreateTeacherAssignmentDto) {
    return this.assignmentService.create(createAssignmentDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findAll(
    @Query('teacherId') teacherId?: string,
    @Query('classId') classId?: string,
  ) {
    if (teacherId) {
      return this.assignmentService.findByTeacher(teacherId);
    }
    if (classId) {
      return this.assignmentService.findByClass(classId);
    }
    return this.assignmentService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.TEACHER)
  findOne(@Param('id') id: string) {
    return this.assignmentService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateAssignmentDto: UpdateTeacherAssignmentDto) {
    return this.assignmentService.update(id, updateAssignmentDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.assignmentService.remove(id);
  }
}

