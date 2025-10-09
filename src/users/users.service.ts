import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { StudentCreateDto } from './dto/create-student.dto';
import { UserRole } from './enums/user-role';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new BadRequestException('User not found');
    return user;
  }

  async updateUser(
    id: number,
    dto: Partial<CreateTeacherDto & StudentCreateDto>,
  ): Promise<User> {
    const user = await this.findById(id);
    Object.assign(user, dto);
    return this.userRepository.save(user);
  }

  async removeUser(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    await this.userRepository.remove(user);
  }

  private async createUser(dto: Partial<User>, createRole: UserRole) {
    if (dto.role === UserRole.TEACHER && createRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admin can create Teacher');
    }
    if (dto.role === UserRole.STUDENT && createRole !== UserRole.TEACHER) {
      throw new ForbiddenException('Only teacher can create student');
    }

    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  async createTeacher(dto: CreateTeacherDto): Promise<User> {
    const hireDate = new Date(dto.hire_date);
    return this.createUser(
      { ...dto, hire_date: hireDate, role: UserRole.TEACHER },
      UserRole.ADMIN,
    );
  }

  async createStudent(dto: StudentCreateDto, teacherId: number) {
    return this.createUser(
      { ...dto, role: UserRole.STUDENT },
      UserRole.TEACHER,
    );
  }

  // 🔹 Updated findByEmail to include password
  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'firstName', 'lastName', 'role', 'password'], // include password
    });
  }

  // 🔹 Updated findByResetToken to include dbToken and password
  async findByResetToken(token: string) {
    return this.userRepository.findOne({
      where: { dbToken: token },
      select: ['id', 'email', 'password', 'dbToken', 'dbTokenExpiry'], // include password
    });
  }

  async create(registerDto: RegisterDto): Promise<User> {
    const user = this.userRepository.create(registerDto);
    return this.userRepository.save(user);
  }

  async save(user: User) {
    return this.userRepository.save(user);
  }
}
