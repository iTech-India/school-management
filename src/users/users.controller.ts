import { Controller, Get } from '@nestjs/common';
import { Roles } from 'src/auth/role.decorator';


@Controller('users')
export class UsersController {
  @Get('all')
  @Roles('admin') 
  getAllUsers() {
    return 'Admin access only';
  }

  @Get('profile')
  @Roles('teacher', 'admin') 
  getProfile() {
    return 'Teacher or Admin can access this';
  }

  @Get('public')
  getPublic() {
    return 'No role required — accessible to all authenticated users';
  }
}
