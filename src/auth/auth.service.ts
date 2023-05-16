import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from 'src/users/dtos/create.user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signInUser(
    user: SignInDto,
  ): Promise<{ accessToken: string } | undefined> {
    const userInfo: User | undefined = await this.usersService.getUserByname(
      user.username,
    );

    const pwCheck = await bcrypt.compare(user.password, userInfo.password);

    if (!userInfo || !pwCheck) {
      throw new HttpException('UNAVAILABLE_USER', HttpStatus.BAD_REQUEST);
    }

    const payload: Payload = { id: userInfo.id, username: userInfo.username };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
