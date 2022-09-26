import { Controller, Post, UseGuards, HttpCode, Request } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthPoliceOfficerService } from './auth-police-officer.service';
import { LoginPoliceDto, PostLoginResponse } from './dto/login-police.dto';
import { LocalAuthPoliceGuard } from './guards/local-auth-police.guard';
import { PayloadTokenPolice } from './models/token-Police.model';

@ApiTags('Auth police')
@Controller('auth-police-officer')
export class AuthPoliceOfficerController {
  constructor(
    private readonly authPoliceOfficerService: AuthPoliceOfficerService,
  ) {}
  @ApiBody({ type: LoginPoliceDto })
  @ApiResponse({ type: PostLoginResponse, status: 200 })
  @UseGuards(LocalAuthPoliceGuard)
  @HttpCode(200)
  @Post('login')
  loginPoliceOfficer(@Request() req: { user: PayloadTokenPolice }) {
    const user = req.user;
    return this.authPoliceOfficerService.loginPoliceOfficer(user);
  }
}
