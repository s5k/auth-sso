import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CollectionService } from '../services/collection.service';
import { CategoryService } from '../services/category.service';
import { PackageService } from '../services/package.service';
import { CreatePackageInput } from '../dto/create-package.input';
import { FindPackageInput } from '../dto/find-package.input';
import { UpdatePackageInput } from '../dto/update-package.input';

@Resolver('Package')
export class PackageResolver {
  constructor(
    private readonly productService: PackageService,
    private readonly collectionService: CollectionService,
    private readonly categoryService: CategoryService,
  ) {}

  @Mutation('createPackage')
  create(@Args('createPackageInput') createPackageInput: CreatePackageInput) {
    return this.productService.create(createPackageInput);
  }

  @Query('packages')
  findAll(findPackageInput: FindPackageInput) {
    return this.productService.findAll(findPackageInput);
  }

  @ResolveField()
  async collection(@Parent() product) {
    const { parent_collection } = product;
    return this.collectionService.findOne(parent_collection);
  }

  @ResolveField()
  async category(@Parent() product) {
    const { category } = product;

    return this.categoryService.findOne(category);
  }

  @Query('getSinglePackage')
  getSinglePackage(@Args('id') id: string) {
    return this.productService.findOne(id);
  }

  @Mutation('updatePackage')
  update(@Args('updatePackageInput') updatePackageInput: UpdatePackageInput) {
    return this.productService.update(
      updatePackageInput.id,
      updatePackageInput,
    );
  }

  @Mutation('removePackage')
  remove(@Args('id') id: string) {
    return this.productService.remove(id);
  }
}
