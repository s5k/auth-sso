import { ExecutionContext } from '@nestjs/common';
import { Dictionary } from 'code-config';
import { User } from '../../features/user/schema/user.schema';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';

export interface Client {
  body: Dictionary<string>;
  headers: Dictionary<string>;
  user: User;
}

type GqlExecutionCtx = GqlExecutionContext | ExecutionContext;

export const getClient = <T = GqlExecutionCtx>(
  ctx: GqlExecutionCtx,
): Client => {
  switch (ctx.getType() as GqlContextType) {
    case 'ws':
      return ctx.switchToWs().getClient().handshake;
    case 'graphql':
      return GqlExecutionContext.create(ctx).getContext().req;
    case 'http':
      return ctx.switchToHttp().getRequest();
    default:
      return undefined;
  }
};
