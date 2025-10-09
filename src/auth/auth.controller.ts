import { BadRequestException, Body, Controller, Get, Post, Query, Req, Res, UnauthorizedException } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { setPasswordDto } from './dto/setpassword.dto';
import { type Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import type { Request } from 'express';
import { Roles } from './role.decorator';
import { ResetPasswordDto } from './dto/resetpassword.dto';

interface AuthenticatedRequest extends Request {
  user: { id: number; email: string; role: string };
}


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Roles('admin')
  @Post('register')
  async createUser(@Body() registerDto: RegisterDto, @Req() req: AuthenticatedRequest) {
    const currentUser = req.user;
    console.log('Current user:', currentUser);
    if(!currentUser) throw new UnauthorizedException('You must be logged in');
    return this.authService.createUser(registerDto, currentUser);
  }

  @Post('login')
  async login(@Body() loginDto: loginDto) {
    return this.authService.login(loginDto);
  }

  @Get('set-password')
  async redirect(@Query('token') token: string, @Res() res: Response) {
    return res.redirect(`http://localhost:3000/reset?token=${token}`);
  }

  @Post('set-password')
async setPassword(
  @Query('token') token: string,      // read token from query
  @Body() setPasswordDto: setPasswordDto,
) {
  const { password, confirmPassword } = setPasswordDto;
  if (!token) throw new BadRequestException('Token is required');
  return this.authService.setPassword(token, password, confirmPassword);
}

  // @Post('reset-password')
  // async resetPassword(@Body() email: string) {
  //   return this.authService.resetPassword(email);
  // }

   @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const { email } = body; // Destructure email from body
    return this.authService.resetPassword(email);
  }


  @Post('logout')
  async logout(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return { message: 'No token provided' };

    const token = authHeader.split(' ')[1];
    if (!token) return { message: 'Invalid token' };

    await this.authService.logout(token);
    return { message: 'logout successfully' };
  }
}
