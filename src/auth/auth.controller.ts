import { Controller, Post, UseGuards, HttpCode, Request } from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, PostLoginResponse } from './dto/login.dto';
import JwtAuthPoliceGuard from './guards/jwt-auth-police.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { PayloadToken } from './models/token.model';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: PostLoginResponse, status: 200 })
  @UseGuards(LocalAuthGuard)
  @HttpCode(200)
  @Post('login-bike-owner')
  loginBikeOwner(@Request() req: { user: PayloadToken }) {
    const user = req.user;
    return this.authService.loginBikeOwner(user);
  }

  @ApiBody({ type: LoginDto })
  @ApiResponse({ type: PostLoginResponse, status: 200 })
  @UseGuards(JwtAuthPoliceGuard)
  @HttpCode(200)
  @Post('login-police-officer')
  loginPoliceOfficer(@Request() req: { user: PayloadToken }) {
    const user = req.user;
    return this.authService.loginPoliceOfficer(user);
  }
}
