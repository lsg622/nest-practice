import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInDto } from 'src/users/dtos/create.user.dto';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { Payload } from './security/payload.interface';
import { JwtService } from '@nestjs/jwt';
// import { UserDTO } from './dto/user.dto';

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

    this.convertInAuthorities(userInfo);
    const payload: Payload = {
      id: userInfo.id,
      username: userInfo.username,
      authorities: userInfo.authorities,
    };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async tokenValidateUser(payload: Payload): Promise<User | undefined> {
    const userInfo = await this.usersService.findByFields({
      where: { id: payload.id },
    });
    this.flatAuthorities(userInfo);
    return userInfo;
  }

  private flatAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: string[] = [];
      user.authorities.forEach((authority) => {
        authorities.push(authority.authorityName);
      });
      user.authorities = authorities;
    }
    return user;
  }

  private convertInAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: any[] = [];
      user.authorities.forEach((authority) => {
        authorities.push({ name: authority.authorityName });
      });
      user.authorities = authorities;
    }
    return user;
  }
}
