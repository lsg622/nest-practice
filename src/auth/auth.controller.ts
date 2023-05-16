import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from 'src/users/dtos/create.user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() signInDto: SignInDto): Promise<any> {
    return await this.authService.signInUser(signInDto);
  }
}
