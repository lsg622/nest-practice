import { Body, Controller, Post, Res } from '@nestjs/common';
import { SignInDto } from 'src/users/dtos/create.user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(
    @Body() signInDto: SignInDto,
    @Res() res: Response,
  ): Promise<any> {
    const jwt = await this.authService.signInUser(signInDto);
    res.setHeader('Authorization', 'Bearer ' + jwt.accessToken);
    return res.json(jwt);
  }
}
