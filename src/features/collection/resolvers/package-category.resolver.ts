import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProductService } from '../services/product.service';
import { CollectionService } from '../services/collection.service';
import { PackageCategoryService } from '../services/package-category.service';
import { CreatePackageCategoryInput } from '../dto/create-package-category.input';
import { FindPackageCategoryInput } from '../dto/find-package-category.input';
import { UpdatePackageCategoryInput } from '../dto/update-package-category.input';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { CollectionGuard } from '../guard/collection.guard';

@Resolver('PackageCategory')
export class PackageCategoryResolver {
  constructor(
    private readonly packageCategoryService: PackageCategoryService,
    private readonly collectionService: CollectionService,
    private readonly productService: ProductService,
  ) {}

  @Mutation('createPackageCategory')
  create(
    @Args('createPackageCategoryInput')
    createProductInput: CreatePackageCategoryInput,
  ) {
    return this.packageCategoryService.create(createProductInput);
  }

  @Query('packageCategories')
  findAll(findInput: FindPackageCategoryInput) {
    return this.packageCategoryService.findAll(findInput);
  }

  @ResolveField()
  async products(@Parent() packageCategory) {
    const { id } = packageCategory;
    return this.productService.findAll({
      packageCategory: id,
    });
  }

  @ResolveField()
  async collection(@Parent() packageCategory) {
    const { parent_collection } = packageCategory;

    return this.collectionService.findOne(parent_collection);
  }

  @Query('getSinglePackageCategory')
  getSinglePackageCategory(@Args('id') id: string) {
    return this.packageCategoryService.findOne(id);
  }

  @Mutation('updatePackageCategory')
  @SetMetadata('CollectionGuard', {
    document: 'PackageCategory',
    param: 'id',
  })
  @UseGuards(JwtAuthGuard, CollectionGuard)
  update(
    @Args('updatePackageCategoryInput')
    updatePackageCategoryInput: UpdatePackageCategoryInput,
  ) {
    return this.packageCategoryService.update(
      updatePackageCategoryInput.id,
      updatePackageCategoryInput,
    );
  }

  @Mutation('removePackageCategory')
  @SetMetadata('CollectionGuard', {
    document: 'PackageCategory',
    param: 'id',
  })
  @UseGuards(JwtAuthGuard, CollectionGuard)
  remove(@Args('id') id: string) {
    return this.packageCategoryService.remove(id);
  }
}
