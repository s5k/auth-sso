import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { ProductService } from '../services/product.service';
import { FindProductInput } from '../dto/find-product.input';
import { Collection } from '../schema/collection.schema';
import { CollectionService } from '../services/collection.service';
import { CategoryService } from '../services/category.service';
import { SetMetadata, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/features/auth/guard/jwt-auth.guard';
import { CollectionGuard } from '../guard/collection.guard';
import { CollectionCreateGuard } from '../guard/collection-create.guard';

@Resolver('Product')
@UseGuards(JwtAuthGuard)
export class ProductResolver {
  constructor(
    private readonly productService: ProductService,
    private readonly collectionService: CollectionService,
    private readonly categoryService: CategoryService,
  ) {}

  @Mutation('createProduct')
  @SetMetadata('CollectionGuard', { param: 'parent_collection' })
  @UseGuards(CollectionCreateGuard)
  create(@Args('createProductInput') createProductInput: CreateProductInput) {
    return this.productService.create(createProductInput);
  }

  @Query('products')
  findAll(findProductInput: FindProductInput) {
    return this.productService.findAll(findProductInput);
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

  @Query('getSingleProduct')
  getSingleProduct(@Args('id') id: string) {
    return this.productService.findOne(id);
  }

  @Mutation('updateProduct')
  @SetMetadata('CollectionGuard', {
    document: 'Product',
    param: 'id',
  })
  @UseGuards(CollectionGuard)
  update(@Args('updateProductInput') updateProductInput: UpdateProductInput) {
    return this.productService.update(
      updateProductInput.id,
      updateProductInput,
    );
  }

  @Mutation('rearrangeProduct')
  @SetMetadata('CollectionGuard', {
    document: 'Product',
    param: 'id',
  })
  @UseGuards(CollectionGuard)
  rearrangeProduct(@Args('id') id: string, @Args('position') position: number) {
    return this.productService.rearrageProduct(id, position);
  }

  @Mutation('removeProduct')
  @SetMetadata('CollectionGuard', {
    document: 'Product',
    param: 'id',
  })
  @UseGuards(CollectionGuard)
  remove(@Args('id') id: string) {
    return this.productService.remove(id);
  }
}
