import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TeacherAssignment } from './entities/teacher-assignment.entity';
import { CreateTeacherAssignmentDto } from './dto/create-teacher-assignment.dto';
import { UpdateTeacherAssignmentDto } from './dto/update-teacher-assignment.dto';

@Injectable()
export class TeacherAssignmentService {
  constructor(
    @InjectRepository(TeacherAssignment)
    private assignmentRepository: Repository<TeacherAssignment>,
  ) {}

  async create(createAssignmentDto: CreateTeacherAssignmentDto): Promise<TeacherAssignment> {
    const assignment = this.assignmentRepository.create(createAssignmentDto);
    return await this.assignmentRepository.save(assignment);
  }

  async findAll(): Promise<TeacherAssignment[]> {
    return await this.assignmentRepository.find({
      relations: ['teacher', 'teacher.user', 'class', 'subject'],
    });
  }

  async findByTeacher(teacherId: string): Promise<TeacherAssignment[]> {
    return await this.assignmentRepository.find({
      where: { teacherId },
      relations: ['class', 'class.students', 'class.students.user', 'class.students.class', 'subject'],
    });
  }

  async findByClass(classId: string): Promise<TeacherAssignment[]> {
    return await this.assignmentRepository.find({
      where: { classId },
      relations: ['teacher', 'teacher.user', 'subject'],
    });
  }

  async findOne(id: string): Promise<TeacherAssignment> {
    const assignment = await this.assignmentRepository.findOne({
      where: { id },
      relations: ['teacher', 'teacher.user', 'class', 'subject'],
    });
    if (!assignment) {
      throw new NotFoundException('Assignment not found');
    }
    return assignment;
  }

  async update(id: string, updateAssignmentDto: UpdateTeacherAssignmentDto): Promise<TeacherAssignment> {
    const assignment = await this.findOne(id);
    Object.assign(assignment, updateAssignmentDto);
    return await this.assignmentRepository.save(assignment);
  }

  async remove(id: string): Promise<void> {
    const assignment = await this.findOne(id);
    await this.assignmentRepository.remove(assignment);
  }
}

