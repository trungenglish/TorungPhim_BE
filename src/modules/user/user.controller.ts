import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { UserWithAuthProviders } from './types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from 'src/common/decorators/role.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles('admin')
  @Get()
  handleFindAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('email/:email')
  handleFindByEmail(
    @Param('email') email: string,
  ): Promise<UserWithAuthProviders | null> {
    return this.userService.findByEmail(email);
  }

  @Roles('admin')
  @Post('create-admin')
  handleCreateUserAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUserAdmin(createUserDto);
  }

  @Patch(':id')
  handleUpdateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.userService.updateProfile(id, updateUserDto);
  }
}
