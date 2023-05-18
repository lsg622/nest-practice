import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { SignInDto } from 'src/users/dtos/create.user.dto';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthGuard } from './security/auth.guard';
import { RolesGuard } from './security/roles.guard';
import { Roles } from './decorator/roll.decorator';
import { RoleType } from './role-type';

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

  @Get('/authenticate')
  @UseGuards(AuthGuard)
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }

  @Get('/admin-role')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleType.ADMIN)
  adminRoleCheck(@Req() req: Request): any {
    const user: any = req.user;
    return user;
  }
}
