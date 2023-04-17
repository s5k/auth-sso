import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Client, getClient } from '../../../shared/utils/get-client';
import { UserService } from '../../user/service/user.service';
import { AUTH_NOT_REQUIRED } from '../decorators/auth-not-required.decorator';
import { AuthService } from '../service/auth.service';
import { throwException } from 'src/shared/utils/throw-exception';

export interface Token {
  sub: string;
  email: string;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  reflector: Reflector;

  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
    @Inject(forwardRef(() => UserService)) private userService: UserService,
  ) {
    this.reflector = new Reflector();
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const client = this.getRequest(ctx);

    const allowAny = this.reflector.get<boolean>(
      AUTH_NOT_REQUIRED,
      ctx.getHandler(),
    );

    try {
      client.user = await this.handleRequest(ctx, client);
    } catch (e) {
      if (allowAny) {
        return true;
      }

      throwException(ctx, e.message);
    }

    return client.user != null;
  }

  private async handleRequest(ctx: ExecutionContext, client: Client) {
    const token = this.getToken(ctx, client);

    const decoded = this.jwtService.decode(token) as Token;

    if (!decoded) {
      throwException(ctx, 'Unable to decode token');
    }

    try {
      const user = await this.validate(decoded);

      await this.jwtService.verifyAsync<Token>(
        token,
        this.authService.getAccessTokenOptions(user),
      );

      return user;
    } catch (e) {
      throwException(ctx, 'Invalid token');
    }
  }

  private validate({ sub }: Token) {
    return this.userService.validateUserById(sub);
  }

  private getToken(ctx: ExecutionContext, client: Client): string {
    const authorization = client.headers.authorization?.split(' ');

    if (!authorization) {
      throwException(ctx, 'Token not found');
    }

    if (authorization[0].toLowerCase() !== 'bearer') {
      throwException(ctx, 'Authorization type not valid');
    }

    if (!authorization[1]) {
      throwException(ctx, 'Token not provided');
    }

    return authorization[1];
  }

  private getRequest(ctx: ExecutionContext) {
    return getClient(ctx);
  }
}
