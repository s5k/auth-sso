import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CollectionService } from '../services/collection.service';
import { Reflector } from '@nestjs/core';
import { throwException } from 'src/shared/utils/throw-exception';
import { getClient } from 'src/shared/utils/get-client';

interface ICollectionGuard {
  param: string;
}

@Injectable()
export class CollectionCreateGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly collectionService: CollectionService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const client = getClient(ctx);
    let collectionId = null;
    const { user } = client;

    if (!user) {
      return false;
    }

    const collectionGuardValue = this.reflector.get<ICollectionGuard>(
      'CollectionGuard',
      ctx.getHandler(),
    );

    if (!collectionGuardValue || !collectionGuardValue.param) {
      throwException(ctx, 'Invalid collection guard');
    }

    collectionId = client.body.variables[collectionGuardValue.param] || null;
    if (!collectionId) {
      throwException(ctx, 'Invalid collection id');
    }

    const collection = await this.collectionService.findOne(collectionId);

    if (!collection) {
      throwException(ctx, 'Collection not found');
    }

    if (!collection.members.includes(user.id)) {
      throwException(ctx, 'You are not the member of this collection');
    }

    return true;
  }
}
