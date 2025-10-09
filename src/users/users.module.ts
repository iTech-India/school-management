import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller'; // import the controller

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController], // register controller here
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
