import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { CollectionService } from '../services/collection.service';
import { CreateCollectionInput } from '../dto/create-collection.input';
import { UpdateCollectionInput } from '../dto/update-collection.input';
import { FindCollectionInput } from '../dto/find-collection.input';
import { ProductService } from '../services/product.service';
import { CategoryService } from '../services/category.service';
import { PackageService } from '../services/package.service';
import { PackageCategoryService } from '../services/package-category.service';
import { Req, SetMetadata, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { CurrentUser } from 'src/features/auth/decorators/current-user.decorator';
import { userInfo } from 'os';
import { CollectionGuard } from '../guard/collection.guard';
import { UserService } from 'src/features/user/service/user.service';

@Resolver('Collection')
@UseGuards(JwtAuthGuard)
export class CollectionResolver {
  constructor(
    private readonly userService: UserService,
    private readonly collectionService: CollectionService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly packageService: PackageService,
    private readonly packageCategoryService: PackageCategoryService,
  ) {}

  @Mutation('createCollection')
  @UseGuards(JwtAuthGuard)
  async create(
    @CurrentUser() userInfo,
    @Args('createCollectionInput') createCollectionInput: CreateCollectionInput,
  ) {
    createCollectionInput.members = [userInfo.id];
    return this.collectionService.create(createCollectionInput);
  }

  @Query('collection')
  findAll(findInput: FindCollectionInput) {
    return this.collectionService.findAll(findInput);
  }

  @ResolveField()
  async members(@Parent() collection) {
    const { members } = collection;
    return this.userService.findAll({ _id: { $in: members } });
  }

  @ResolveField()
  async categories(@Parent() collection) {
    const { id } = collection;
    return this.categoryService.findAll({ parent_collection: id });
  }

  @ResolveField()
  async products(@Parent() collection) {
    const { id } = collection;

    return this.productService.findAll({
      parent_collection: id,
      category: null,
    });
  }

  @ResolveField()
  async packages(@Parent() collection) {
    const { id } = collection;
    return this.packageService.findAll({
      parent_collection: id,
      category: null,
    });
  }

  @ResolveField()
  async packageCategories(@Parent() collection) {
    const { id } = collection;
    return this.packageCategoryService.findAll({ parent_collection: id });
  }

  @Query('getSingleCollection')
  findOne(@Args('id') id: string) {
    return this.collectionService.findOne(id);
  }

  @Mutation('updateCollection')
  @SetMetadata('CollectionGuard', { document: 'Collection', param: 'id' })
  @UseGuards(CollectionGuard)
  update(
    @Args('updateCollectionInput') updateCollectionInput: UpdateCollectionInput,
  ) {
    return this.collectionService.update(
      updateCollectionInput.id,
      updateCollectionInput,
    );
  }

  @Mutation('removeCollection')
  @SetMetadata('CollectionGuard', { document: 'Collection', param: 'id' })
  @UseGuards(CollectionGuard)
  remove(@Args('id') id: string) {
    return this.collectionService.remove(id);
  }
}
