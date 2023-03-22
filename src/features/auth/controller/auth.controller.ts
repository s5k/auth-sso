import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { User } from '../../user/schema/user.schema';
import { UserService } from '../../user/service/user.service';
import { CurrentUser } from '../decorators/current-user.decorator';
import { AuthService } from '../service/auth.service';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { FacebookAuthService } from 'facebook-auth-nestjs';
import { GoogleAuthService } from '../service/google-auth.service';
import { Dictionary } from 'code-config';
import { Response } from 'express';
import { authConfig } from '../config/auth.config';
import { stringify } from 'qs';
import { AuthNotRequired } from '../decorators/auth-not-required.decorator';
import { environments } from 'src/environments/environments';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private facebookService: FacebookAuthService,
    private googleService: GoogleAuthService,
  ) {}

  @Post('login')
  async login(@Body() body: LoginDto) {
    return this.authService.login(
      await this.authService.validate(body.username, body.password),
    );
  }

  @Post('facebook-login')
  @AuthNotRequired()
  @UseGuards(JwtAuthGuard)
  async facebookLogin(
    @CurrentUser() user: User,
    @Body('accessToken') accessToken: string,
  ) {
    return this.authService.loginWithThirdParty('facebookId', () =>
      this.facebookService.getUser(
        accessToken,
        'id',
        'name',
        'email',
        'first_name',
        'last_name',
      ),
    );
  }

  @Post('google-login')
  @AuthNotRequired()
  @UseGuards(JwtAuthGuard)
  async googleLogin(
    @CurrentUser() user: User,
    @Body('accessToken') accessToken: string,
  ) {
    return this.authService.loginWithThirdParty(
      'googleId',
      () => this.googleService.getUser(accessToken),
      user,
    );
  }

  @Post('refresh-token')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.loginWithRefreshToken(refreshToken);
  }

  @Post('register')
  async register(@Body() body: RegisterDto) {
    if (await this.userService.getUserByName(body.username)) {
      throw new BadRequestException('Username already exists');
    }

    if (await this.userService.getUserByEmail(body.email)) {
      throw new BadRequestException('Email already exists');
    }

    const user = await this.userService.create(body);
    this.userService.sendVerifyEmail(user);

    return {
      status: true,
      message: 'User created successfully, please verify your email.',
    };
  }

  @Get('verify-email/:code')
  async verifyEmail(@Res() res: Response, @Param('code') token: string) {
    const user = await this.userService.getUserByVerifyEmailToken(token);

    if (!user || (await !this.userService.confirmVerifiedEmail(user))) {
      throw new BadRequestException('Invalid token');
    }

    res.redirect(environments.frontEndUrl);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return this.userService.filterUser(user, ['email']);
  }
}
