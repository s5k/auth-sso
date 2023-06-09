import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CategoryService } from '../services/category.service';
import { CreateCategoryInput } from '../dto/create-category.input';
import { UpdateCategoryInput } from '../dto/update-category.input';
import { FindCategoryInput } from '../dto/find-category.input';
import { ProductService } from '../services/product.service';
import { CollectionService } from '../services/collection.service';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { CollectionGuard } from '../guard/collection.guard';
import { CollectionCreateGuard } from '../guard/collection-create.guard';

@Resolver('Category')
@UseGuards(JwtAuthGuard)
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly collectionService: CollectionService,
    private readonly productService: ProductService,
  ) {}

  @Mutation('createCategory')
  @SetMetadata('CollectionGuard', { param: 'parent_collection' })
  @UseGuards(CollectionCreateGuard)
  create(@Args('createCategoryInput') createProductInput: CreateCategoryInput) {
    return this.categoryService.create(createProductInput);
  }

  @Query('categories')
  findAll(findInput: FindCategoryInput) {
    return this.categoryService.findAll(findInput);
  }

  @ResolveField()
  async products(@Parent() category) {
    const { id } = category;
    return this.productService.findAll({
      category: id,
    });
  }

  @ResolveField()
  async collection(@Parent() category) {
    const { parent_collection } = category;

    return this.collectionService.findOne(parent_collection);
  }

  @Query('getSingleCategory')
  getSingleCategory(@Args('id') id: string) {
    return this.categoryService.findOne(id);
  }

  @Mutation('updateCategory')
  @SetMetadata('CollectionGuard', {
    document: 'Category',
    param: 'id',
  })
  @UseGuards(CollectionGuard)
  update(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation('rearrangeCategory')
  @SetMetadata('CollectionGuard', {
    document: 'Category',
    param: 'id',
  })
  @UseGuards(CollectionGuard)
  rearrangeProduct(@Args('id') id: string, @Args('position') position: number) {
    return this.categoryService.rearrageCategory(id, position);
  }

  @Mutation('removeCategory')
  @SetMetadata('CollectionGuard', {
    document: 'Category',
    param: 'id',
  })
  @UseGuards(CollectionGuard)
  remove(@Args('id') id: string) {
    return this.categoryService.remove(id);
  }
}
