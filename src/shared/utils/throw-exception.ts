import { Socket } from 'socket.io';
import {
  GqlContextType,
  GqlExecutionContext,
  GraphQLExecutionContext,
} from '@nestjs/graphql';
import { AuthenticationError } from '@nestjs/apollo';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

type CtxExecutionContext = GraphQLExecutionContext | ExecutionContext;

export function throwException(ctx: CtxExecutionContext, message: string) {
  if (ctx.getType() === 'ws') {
    ctx.switchToWs().getClient<Socket>().disconnect(true);
  }

  if ((ctx.getType() as GqlContextType) === 'graphql') {
    throw new AuthenticationError(message);
  }

  throw new UnauthorizedException(message);
}
