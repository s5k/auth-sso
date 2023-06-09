import { Module } from '@nestjs/common';
import { CollectionService } from './services/collection.service';
import { CollectionResolver } from './resolvers/collection.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Collection, CollectionSchema } from './schema/collection.schema';
import { ProductService } from './services/product.service';
import { Product, ProductSchema } from './schema/product.schema';
import { Category, CategorySchema } from './schema/category.schema';
import { CategoryService } from './services/category.service';
import { CategoryResolver } from './resolvers/category.resolver';
import { ProductResolver } from './resolvers/product.resolver';
import { Package, PackageSchema } from './schema/package.schema';
import {
  PackageCategory,
  PackageCategorySchema,
} from './schema/package-category.schema';
import { PackageService } from './services/package.service';
import { PackageResolver } from './resolvers/package.resolver';
import { PackageCategoryService } from './services/package-category.service';
import { PackageCategoryResolver } from './resolvers/package-category.resolver';
import { AuthModule } from '../auth/auth.module';
import { CollectionController } from './controller/collection.controller';
import { InvitationService } from './services/invitation.service';
import { Invitation, InvitationSchema } from './schema/invitation.schema';
import { UserModule } from '../user/user.module';
import { UserCreatedListener } from './listeners/user-created.listener';

@Module({
  imports: [
    AuthModule,
    UserModule,
    MongooseModule.forFeature([
      {
        name: Collection.name,
        schema: CollectionSchema,
      },
      {
        name: Product.name,
        schema: ProductSchema,
      },
      {
        name: Category.name,
        schema: CategorySchema,
      },
      {
        name: Package.name,
        schema: PackageSchema,
      },
      {
        name: PackageCategory.name,
        schema: PackageCategorySchema,
      },
      {
        name: Invitation.name,
        schema: InvitationSchema,
      },
    ]),
  ],
  providers: [
    CollectionResolver,
    CollectionService,
    ProductService,
    ProductResolver,
    CategoryService,
    CategoryResolver,
    PackageService,
    PackageResolver,
    PackageCategoryService,
    PackageCategoryResolver,
    InvitationService,
    UserCreatedListener,
  ],
  controllers: [CollectionController],
  exports: [CollectionService],
})
export class CollectionModule {}
