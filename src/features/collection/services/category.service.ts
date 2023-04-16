import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, isValidObjectId } from 'mongoose';
import { Category, CategoryDocument } from '../schema/category.schema';
import { CreateCategoryInput } from '../dto/create-category.input';
import { UpdateCategoryInput } from '../dto/update-category.input';
import { BaseService } from './base.service';
import { Collection, CollectionDocument } from '../schema/collection.schema';
import { Product, ProductDocument } from '../schema/product.schema';
import { FindCategoryInput } from '../dto/find-category.input';

@Injectable()
export class CategoryService extends BaseService<
  Category,
  CreateCategoryInput,
  UpdateCategoryInput,
  FindCategoryInput
> {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<CategoryDocument>,
    @InjectModel(Collection.name)
    private readonly collectionModel: Model<CollectionDocument>,
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(categoryModel);
  }

  async create(createInput: CreateCategoryInput | any): Promise<Category> {
    const newCategory = await super.create(createInput);

    if (isValidObjectId(newCategory.parent_collection)) {
      const collection = await this.collectionModel.findById(
        newCategory.parent_collection,
      );

      if (!collection) {
        throw new Error('Collection not found');
      }

      collection.categories.push(newCategory._id);
      await collection.save();
    }

    return newCategory;
  }

  async remove(id: string): Promise<Category> {
    const category = await super.remove(id);

    // unassign category from collection
    if (isValidObjectId(category.parent_collection)) {
      const collection = await this.collectionModel.findById(
        category.parent_collection,
      );
      if (!collection) {
        throw new Error('Collection not found');
      }

      collection.categories = collection.categories.filter(
        category => category.toString() !== id,
      );
      await collection.save();
    }

    // unassign category from products by setting category to null
    await this.productModel.updateMany(
      { category: new Types.ObjectId(id) },
      { category: null },
    );

    return category;
  }
}
