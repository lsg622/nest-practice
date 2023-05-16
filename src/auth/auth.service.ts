import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from 'src/users/dtos/create.user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signInUser(user: SignInDto) {
    const userInfo: User | undefined = await this.usersService.getUserByname(
      user.username,
    );

    const pwCheck = await bcrypt.compare(user.password, userInfo.password);

    if (!userInfo || !pwCheck) {
      throw new HttpException('UNAVAILABLE_USER', HttpStatus.BAD_REQUEST);
    }
  }
}
