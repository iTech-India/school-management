import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { SetPasswordDto } from './dto/set-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserRole } from '../users/enums/user-role.enum';
import { Student } from '../student/entities/student.entity';
import * as bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user already exists
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Create user with student role by default
    const user = await this.usersService.create({
      email: registerDto.email,
      role: UserRole.STUDENT,
    });

    // Update password
    await this.usersService.updatePasswordOnly(user.id, hashedPassword);

    // Generate unique roll number
    const rollNumber = await this.generateRollNumber();

    // Create student profile
    const student = this.studentRepository.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      phoneNumber: registerDto.phoneNumber,
      dateOfBirth: registerDto.dateOfBirth || null,
      rollNumber: rollNumber,
      admissionDate: new Date(),
      userId: user.id,
    });
    await this.studentRepository.save(student);

    // Generate verification token
    const verificationToken = randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24); // Token valid for 24 hours

    await this.usersService.setVerificationToken(user.id, verificationToken, expiry);

    // Send verification email
    await this.mailService.sendVerificationEmail(registerDto.email, verificationToken);

    return {
      message: 'Registration successful! Please check your email to verify your account.',
      email: registerDto.email,
    };
  }

  private async generateRollNumber(): Promise<string> {
    //const year = new Date().getFullYear();
    // const count = await this.studentRepository.count();
    // const paddedCount = String(count + 1).padStart(4, '0');
    // return `STU${paddedCount}`;

    const lastStudent = await this.studentRepository
          .createQueryBuilder('student')
          .orderBy('student.rollNumber', 'DESC')
          .getOne();

    const nextNumber = lastStudent ? parseInt(lastStudent.rollNumber.replace('STU', ''), 10) + 1 : 1;

    const formattedId = `STU${nextNumber.toString().padStart(3, '0')}`;

    return formattedId;
  }

  async verifyEmail(verifyEmailDto: VerifyEmailDto) {
    const user = await this.usersService.findByVerificationToken(verifyEmailDto.token);

    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    if (user.verificationTokenExpiry && user.verificationTokenExpiry < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    await this.usersService.verifyEmail(user.id);
    await this.usersService.activateUser(user.id);

    return { message: 'Email verified successfully! You can now login.' };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.emailVerified && user.role === UserRole.STUDENT) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    if (!user.passwordSet || !user.password) {
      throw new UnauthorizedException('Please set your password first');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  async setPassword(setPasswordDto: SetPasswordDto) {
    if (setPasswordDto.password !== setPasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.usersService.findByResetToken(setPasswordDto.token);
    
    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Token has expired');
    }

    const hashedPassword = await bcrypt.hash(setPasswordDto.password, 10);
    
    await this.usersService.updatePassword(user.id, hashedPassword);
    await this.usersService.activateUser(user.id);
    // Verify email for admin-created users (teachers/students via invitation)
    await this.usersService.verifyEmail(user.id);

    return { message: 'Password set successfully! You can now login.' };
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findByEmail(forgotPasswordDto.email);
    
    if (!user) throw new BadRequestException("Email not found");
      // Don't reveal if email exists or not for security
      //return { message: 'If your email is registered, you will receive a password reset link.' };
    

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1); // Token valid for 1 hour

    await this.usersService.setResetToken(user.id, resetToken, expiry);

    // Send reset email
    await this.mailService.sendPasswordResetEmail(user.email, resetToken);

    return { message: 'If your email is registered, you will receive a password reset link.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    if (resetPasswordDto.password !== resetPasswordDto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.usersService.findByResetToken(resetPasswordDto.token);
    
    if (!user) {
      throw new BadRequestException('Invalid or expired token');
    }

    if (user.resetTokenExpiry && user.resetTokenExpiry < new Date()) {
      throw new BadRequestException('Token has expired');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
    
    // Update password and clear reset token
    await this.usersService.updatePassword(user.id, hashedPassword);

    return { message: 'Password reset successfully! You can now login with your new password.' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
      throw new BadRequestException('New passwords do not match');
    }

    const user = await this.usersService.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      changePasswordDto.currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    // Check if new password is different from current
    const isSamePassword = await bcrypt.compare(changePasswordDto.newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.usersService.updatePasswordOnly(user.id, hashedPassword);

    return { message: 'Password changed successfully!' };
  }

  async generateResetToken(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 24); // Token valid for 24 hours

    await this.usersService.setResetToken(userId, token, expiry);
    
    return token;
  }
}
