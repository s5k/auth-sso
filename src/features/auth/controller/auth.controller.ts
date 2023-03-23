import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FacebookAuthService } from 'facebook-auth-nestjs';
import { User } from '../../user/schema/user.schema';
import { UserService } from '../../user/service/user.service';
import { AuthNotRequired } from '../decorators/auth-not-required.decorator';
import { CurrentUser } from '../decorators/current-user.decorator';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { VerifyAccountDto } from '../dto/verify-account.dto';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { AuthService } from '../service/auth.service';
import { GoogleAuthService } from '../service/google-auth.service';

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
      await this.authService.validate(body.email, body.password),
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

  @Post('verify-account')
  async verifyAccount(@Body() body: VerifyAccountDto) {
    const user = await this.userService.getUserByEmail(body.email);

    if (!user) {
      throw new BadRequestException('User not found');
    }

    if (user && user.verifyCode !== body.code) {
      throw new BadRequestException('Invalid active code');
    }

    if (await !this.userService.doActiveUser(user)) {
      throw new BadRequestException('Active user failed');
    }

    return {
      status: true,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: User) {
    return this.userService.filterUser(user, ['email']);
  }
}
