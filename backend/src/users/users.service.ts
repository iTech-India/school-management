import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return await this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async findByResetToken(token: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { resetToken: token } });
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, {
      password: hashedPassword,
      passwordSet: true,
      resetToken: null,
      resetTokenExpiry: null,
    });
  }

  async setResetToken(userId: string, token: string, expiry: Date): Promise<void> {
    await this.userRepository.update(userId, {
      resetToken: token,
      resetTokenExpiry: expiry,
    });
  }

  async activateUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, { isActive: true });
  }

  async deactivateUser(userId: string): Promise<void> {
    await this.userRepository.update(userId, { isActive: false });
  }

  async setVerificationToken(userId: string, token: string, expiry: Date): Promise<void> {
    await this.userRepository.update(userId, {
      verificationToken: token,
      verificationTokenExpiry: expiry,
    });
  }

  async findByVerificationToken(token: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { verificationToken: token } });
  }

  async verifyEmail(userId: string): Promise<void> {
    await this.userRepository.update(userId, {
      emailVerified: true,
      verificationToken: null,
      verificationTokenExpiry: null,
    });
  }

  async updatePasswordOnly(userId: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(userId, {
      password: hashedPassword,
      passwordSet: true,
    });
  }

  

}

