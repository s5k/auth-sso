import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { FacebookAuthModule } from 'facebook-auth-nestjs';
import { UserModule } from '../user/user.module';
import { authConfig } from './config/auth.config';
import { AuthController } from './controller/auth.controller';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { AuthService } from './service/auth.service';
import { GoogleAuthService } from './service/google-auth.service';
import { environments } from 'src/environments/environments';

const facebook = authConfig.facebook;

export
@Module({
  imports: [
    ConfigModule,
    JwtModule.register({ secret: environments.jwtSecret }),
    FacebookAuthModule.forRoot({
      clientId: facebook.appId as number,
      clientSecret: facebook.appSecret,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, GoogleAuthService],
  exports: [JwtAuthGuard, AuthService, JwtModule, ConfigModule, UserModule],
})
class AuthModule {}
