import { Controller, Post, UseGuards, HttpCode, Request } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthBikeOwnerService } from './auth-bike-owner.service';
import {
  LoginBikeOwnerDto,
  PostLoginResponse,
} from './dto/login-bike-owner.dto';
import { LocalAuthBikeOwnerGuard } from './guards/local-auth-bike-owner.guard';
import { PayloadTokenBikeOwner } from './models/token-bike-owner.model';

@ApiTags('Auth bike owner')
@Controller('auth-bike-owner')
export class AuthBikeOwnerController {
  constructor(private readonly authBikeOwnerService: AuthBikeOwnerService) {}
  @ApiBody({ type: LoginBikeOwnerDto })
  @ApiResponse({ type: PostLoginResponse, status: 200 })
  @UseGuards(LocalAuthBikeOwnerGuard)
  @HttpCode(200)
  @Post('login')
  loginBikeOwner(@Request() req: { user: PayloadTokenBikeOwner }) {
    const user = req.user;
    return this.authBikeOwnerService.loginBikeOwner(user);
  }
}
