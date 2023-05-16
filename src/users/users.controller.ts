import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from 'src/reponse/api.response';
import { CreateUserDto } from './dtos/create.user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.usersService.createUser(createUserDto);
    return new ApiResponse(HttpStatus.CREATED, createdUser);
  }

  @Get()
  async findAll() {
    const users = await this.usersService.findAll();
    return new ApiResponse(HttpStatus.OK, users);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    return new ApiResponse(HttpStatus.OK, user);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: CreateUserDto) {
    const user = await this.usersService.update(+id, updateUserDto);
    return new ApiResponse(HttpStatus.OK, user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(+id);
    return new ApiResponse(HttpStatus.OK, id);
  }
}
