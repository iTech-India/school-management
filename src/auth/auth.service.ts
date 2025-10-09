import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from 'src/users/enums/user-role';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async createUser(registerDto: RegisterDto,currentUser:any) {
    // Check if user already exists
    if(currentUser.role=== UserRole.ADMIN&&registerDto.role!==UserRole.TEACHER){
      throw new ForbiddenException('Admin can only create teacher');
    }
    if(currentUser.role===UserRole.TEACHER&&registerDto.role!==UserRole.STUDENT){
      throw new ForbiddenException('Teachers can only create the students');
    }
    if(![UserRole.ADMIN,UserRole.TEACHER].includes(currentUser.role)){
      throw new ForbiddenException('unaothorized user')
    }
    
    let user = await this.userService.findByEmail(registerDto.email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    // Create user with only necessary fields
    user = await this.userService.create({
      email: registerDto.email,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName || '',
      role: registerDto.role,
    });
    user.createdAt = new Date();
    user.updatedAt = new Date();
    // Generate a token for setting password
    const token = crypto.randomBytes(32).toString('hex');
    user.dbToken = token;
    user.dbTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    // Save user
    await this.userService.save(user);

    // Send email to user to set password
    await this.mailService.sendPassMail(user.email, token);

    return {
      message:
        'Registered successfully. Please check your mail to set password.',
    };
  }

  //login
  async login(loginDto: loginDto) {
    const user = await this.userService.findByEmail(loginDto.email);

    if (!user || !user.password) {
      throw new BadRequestException('User Not Found');
    }

    const match = await bcrypt.compare(loginDto.password, user.password);
    if (!match) {
      throw new BadRequestException('Invalid Cretential');
    }
    const payload = { id: user.id, email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
    });
    return {
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    };
  }

  //setPassword
  async setPassword(token: string, password: string, confrimPassword: string) {
    const user = await this.userService.findByResetToken(token);

    if (
      !user ||
      !user.dbToken ||
      !user.dbTokenExpiry ||
      user.dbTokenExpiry < new Date()
    ) {
      throw new BadRequestException('Invalid or Expired Token');
    }
    if (password !== confrimPassword) {
      throw new BadRequestException('Password do not  match');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    user.password = hash;
    user.dbToken = null;
    user.dbTokenExpiry = null;
    user.is_verified = true;

    await this.userService.save(user);

    return { message: 'Password Set Succesfully' };
  }

  // //resetPassword
  // async resetPassword(email: string) {
  //   const user = await this.userService.findByEmail(email);

  //   if (!user) {
  //     throw new Error('User not found');
  //   }
  //   const token = crypto.randomBytes(32).toString('hex');

  //   user.dbToken = token;
  //   user.dbTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

  //   await this.userService.save(user);

  //   await this.mailService.sendPassMail(user.email, token);

  //   return {
  //     message: 'Please check the mail to reset password',
  //   };
  // }
   async resetPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found'); // better than generic Error
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    user.dbToken = token;
    user.dbTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour expiry

    try {
      await this.userService.save(user); // save user with token
      await this.mailService.sendPassMail(user.email, token); // send email

      return {
        message: 'Please check your email to reset the password',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to reset password');
    }
  }

  //logout
  async logout(token: string) {
    return;
  }
}
