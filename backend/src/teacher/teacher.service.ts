import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './entities/teacher.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    private usersService: UsersService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  async create(createTeacherDto: CreateTeacherDto): Promise<Teacher> {
    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(createTeacherDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Check if employee ID already exists
    const existingTeacher = await this.teacherRepository.findOne({
      where: { employeeId: createTeacherDto.employeeId },
    });
    if (existingTeacher) {
      throw new BadRequestException('Employee ID already exists');
    }

    // Create user account
    const user = await this.usersService.create({
      email: createTeacherDto.email,
      role: UserRole.TEACHER,
    });

    // Generate reset token for password setup
    const resetToken = await this.authService.generateResetToken(user.id);

    // Create teacher profile
    const teacher = this.teacherRepository.create({
      ...createTeacherDto,
      userId: user.id,
    });

    const savedTeacher = await this.teacherRepository.save(teacher);

    // Send invitation email
    await this.mailService.sendInvitationEmail(
      createTeacherDto.email,
      resetToken,
      'Teacher',
      createTeacherDto.firstName,
    );

    return savedTeacher;
  }

  async findAll(): Promise<Teacher[]> {
    return await this.teacherRepository.find({
      relations: ['user', 'assignments', 'assignments.class', 'assignments.subject'],
    });
  }

  async findOne(id: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { id },
      relations: ['user', 'assignments', 'assignments.class', 'assignments.subject'],
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher;
  }

  async findByUserId(userId: string): Promise<Teacher> {
    const teacher = await this.teacherRepository.findOne({
      where: { userId },
      relations: ['user', 'assignments', 'assignments.class', 'assignments.subject'],
    });
    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }
    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto): Promise<Teacher> {
    const teacher = await this.findOne(id);
    Object.assign(teacher, updateTeacherDto);
    return await this.teacherRepository.save(teacher);
  }

  async remove(id: string): Promise<void> {
    const teacher = await this.findOne(id);
    await this.usersService.deactivateUser(teacher.userId);

    await this.teacherRepository.remove(teacher);
  }

  //added
  async delete(id : string) : Promise<void>{

    const teacher = await this.findOne(id);

    await this.teacherRepository.delete(teacher);
  }

  async getNextEmployeeId(): Promise<string>{
    const lastTeacher = await this.teacherRepository
          .createQueryBuilder('teacher')
          .orderBy('teacher.employeeId', 'DESC')
          .getOne();

    const nextNumber = lastTeacher ? parseInt(lastTeacher.employeeId.replace('EMP', ''), 10) + 1 : 1;

    const formattedId = `EMP${nextNumber.toString().padStart(3, '0')}`;

    return formattedId;
  }
}

