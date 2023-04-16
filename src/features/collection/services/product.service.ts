import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model, Query, Types, isValidObjectId } from 'mongoose';
import { Product, ProductDocument } from '../schema/product.schema';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { BaseService } from './base.service';
import { Collection, CollectionDocument } from '../schema/collection.schema';
import { Category, CategoryDocument } from '../schema/category.schema';
import { isEmpty } from 'class-validator';
import { FindProductInput } from '../dto/find-product.input';

@Injectable()
export class ProductService extends BaseService<
  Product,
  CreateProductInput,
  UpdateProductInput,
  FindProductInput
> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<CollectionDocument>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
  ) {
    super(productModel);
  }

  async create(createInput: CreateProductInput | any): Promise<Product> {
    const newProduct = await super.create(createInput);

    console.log(newProduct.category);

    if (isValidObjectId(newProduct.category)) {
      const category = await this.categoryModel.findById(newProduct.category);

      if (!category) {
        throw new Error('Category not found');
      }

      category.products.push(newProduct._id);
      await category.save();
    }

    if (isValidObjectId(newProduct.parent_collection)) {
      const collection = await this.collectionModel.findById(
        newProduct.parent_collection,
      );
      if (!collection) {
        throw new Error('Collection not found');
      }
      collection.products.push(newProduct._id);
      await collection.save();
    }

    return newProduct;
  }

  async remove(id: string): Promise<Product> {
    const product = await super.remove(id);

    if (isValidObjectId(product.category)) {
      const category = await this.categoryModel.findById(product.category);

      if (!category) {
        throw new Error('Category not found');
      }

      category.products = category.products.filter(
        p => p.toString() !== product._id.toString(),
      );
      await category.save();
    }

    if (isValidObjectId(product.parent_collection)) {
      const collection = await this.collectionModel.findById(
        product.parent_collection,
      );
      if (!collection) {
        throw new Error('Collection not found');
      }
      collection.products = collection.products.filter(
        p => p.toString() !== product._id.toString(),
      );
      await collection.save();
    }

    return product;
  }
}
