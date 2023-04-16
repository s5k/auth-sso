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

@Resolver('Category')
export class CategoryResolver {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly collectionService: CollectionService,
    private readonly productService: ProductService,
  ) {}

  @Mutation('createCategory')
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
  update(
    @Args('updateCategoryInput') updateCategoryInput: UpdateCategoryInput,
  ) {
    return this.categoryService.update(
      updateCategoryInput.id,
      updateCategoryInput,
    );
  }

  @Mutation('removeCategory')
  remove(@Args('id') id: string) {
    return this.categoryService.remove(id);
  }
}
