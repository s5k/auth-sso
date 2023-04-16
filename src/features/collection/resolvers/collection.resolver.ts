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

@Resolver('Collection')
export class CollectionResolver {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
    private readonly packageService: PackageService,
    private readonly packageCategoryService: PackageCategoryService,
  ) {}

  @Mutation('createCollection')
  create(
    @Args('createCollectionInput') createCollectionInput: CreateCollectionInput,
  ) {
    return this.collectionService.create(createCollectionInput);
  }

  @Query('collection')
  findAll(findInput: FindCollectionInput) {
    return this.collectionService.findAll(findInput);
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
  update(
    @Args('updateCollectionInput') updateCollectionInput: UpdateCollectionInput,
  ) {
    return this.collectionService.update(
      updateCollectionInput.id,
      updateCollectionInput,
    );
  }

  @Mutation('removeCollection')
  remove(@Args('id') id: string) {
    return this.collectionService.remove(id);
  }
}
