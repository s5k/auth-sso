import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { getClient } from 'src/shared/utils/get-client';
import { CollectionService } from '../services/collection.service';
import { PackageService } from '../services/package.service';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { PackageCategoryService } from '../services/package-category.service';
import { camelize } from 'src/shared/utils/camelize';
import { throwException } from 'src/shared/utils/throw-exception';

interface ICollectionGuard {
  document: string;
  param: string;
}

@Injectable()
export class CollectionGuard implements CanActivate {
  private allowedCollections = [
    'Collection',
    'Package',
    'Category',
    'PackageCategory',
    'Product',
  ];

  constructor(
    private readonly collectionService: CollectionService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly packageService: PackageService,
    private readonly packageCategoryService: PackageCategoryService,
    private readonly reflector: Reflector,
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

    if (
      !collectionGuardValue ||
      !collectionGuardValue.document ||
      !collectionGuardValue.param ||
      !this.allowedCollections.includes(collectionGuardValue.document)
    ) {
      throwException(ctx, 'Invalid collection guard');
    }

    const id = client.body.variables[collectionGuardValue.param] || null;
    if (!id) {
      throwException(ctx, 'Invalid id');
    }

    if (collectionGuardValue.document === 'Collection') {
      collectionId = id;
    } else {
      collectionId = await this[
        camelize(collectionGuardValue.document) + 'Service'
      ].getCollectionByModelId(id, 'parent_collection');
    }

    if (!collectionId) throwException(ctx, 'Invalid document type');

    const collection = await this.collectionService.findOne(collectionId);
    if (collection.members.includes(client.user.id)) {
      return true;
    }

    throwException(ctx, "You're not a member of the collection");
  }
}
