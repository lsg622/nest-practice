import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dtos/create.user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repository: Repository<User>) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password } = createUserDto;

    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = this.repository.create({
      username: username,
      password: hashedPassword,
    });

    return await this.repository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<User> {
    return await this.repository.findOne({ where: { id } });
  }

  async update(id: number, updateUserDto: CreateUserDto): Promise<User> {
    const { username, password } = updateUserDto;

    const user = await this.findOne(id);
    user.username = username;
    user.password = password;
    return this.repository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.repository.delete(id);
  }

  async getUserByname(name: string): Promise<User> {
    try {
      return await this.repository.findOneBy({ username: name });
    } catch (err) {
      throw new HttpException('Cause Error', HttpStatus.BAD_REQUEST);
    }
  }
}
