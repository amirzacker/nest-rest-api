import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() userData: Partial<User>): Promise<User> {
    return this.userService.createUser(userData);
  }

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  findById(@Param('id') id: string): Promise<User> {
    return this.userService.findUserById(+id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() userData: Partial<User>,
  ): Promise<User> {
    return this.userService.updateUser(+id, userData);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.userService.deleteUser(+id);
  }
}
