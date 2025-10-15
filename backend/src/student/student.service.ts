import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/enums/user-role.enum';
import { AuthService } from '../auth/auth.service';
import { MailService } from '../mail/mail.service';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    private usersService: UsersService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Check if email already exists
    const existingUser = await this.usersService.findByEmail(createStudentDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    // Check if roll number already exists
    const existingStudent = await this.studentRepository.findOne({
      where: { rollNumber: createStudentDto.rollNumber },
    });
    if (existingStudent) {
      throw new BadRequestException('Roll number already exists');
    }

    // Create user account
    const user = await this.usersService.create({
      email: createStudentDto.email,
      role: UserRole.STUDENT,
    });

    // Generate reset token for password setup
    const resetToken = await this.authService.generateResetToken(user.id);

    // Create student profile
    const student = this.studentRepository.create({
      ...createStudentDto,
      userId: user.id,
    });

    const savedStudent = await this.studentRepository.save(student);

    // Send invitation email
    await this.mailService.sendInvitationEmail(
      createStudentDto.email,
      resetToken,
      'Student',
      createStudentDto.firstName,
    );

    return savedStudent;
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find({
      relations: ['user', 'class', 'attendances'],
    });
  }

  async findByClass(classId: string): Promise<Student[]> {
    return await this.studentRepository.find({
      where: { classId },
      relations: ['user', 'class'],
    });
  }

  async findOne(id: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: ['user', 'class', 'attendances'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async findByUserId(userId: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { userId },
      relations: ['user', 'class', 'attendances'],
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }
    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(id);
    Object.assign(student, updateStudentDto);
    return await this.studentRepository.save(student);
  }

  async remove(id: string): Promise<void> {
    const student = await this.findOne(id);
    await this.usersService.deactivateUser(student.userId);
  }

  async getNextRollNumberId(): Promise<string>{
    const lastStudent = await this.studentRepository
          .createQueryBuilder('student')
          .orderBy('student.rollNumber', 'DESC')
          .getOne();

    const nextNumber = lastStudent ? parseInt(lastStudent.rollNumber.replace('STU', ''), 10) + 1 : 1;

    const formattedId = `STU${nextNumber.toString().padStart(3, '0')}`;

    return formattedId;
  }
}

