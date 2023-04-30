import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schema/category.schema';
import { CreateCategoryInput } from '../dto/create-category.input';
import { UpdateCategoryInput } from '../dto/update-category.input';
import { BaseService } from './base.service';
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
  ) {
    super(categoryModel);
  }

  async findAll(findInput: FindCategoryInput): Promise<Category[]> {
    const results = await this.model.find(findInput, null, {
      sort: { position: 'ASC' },
    });

    if (!results) {
      return [];
    }

    return results;
  }

  async rearrageCategory(
    categoryId: string,
    position: number,
  ): Promise<Category[]> {
    const category = await this.model.findById(categoryId);

    if (!category) {
      return null;
    }

    const { parent_collection } = category;

    const categories = await this.model.find(
      {
        parent_collection,
      },
      null,
      { sort: { position: 'ASC' } },
    );

    if (!categories) {
      return null;
    }

    // Locate the category that we want to move
    const categoryToMove = categories.find(
      category => category._id.toString() === categoryId,
    );

    if (!categoryToMove) {
      return null;
    }

    // Remove the category from the list
    const indexToRemove = categories.indexOf(categoryToMove);
    categories.splice(indexToRemove, 1);

    // Insert the category back into the list at the desired position
    categories.splice(position - 1, 0, categoryToMove);

    // Update the positions of the remaining products in the list
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];
      category.position = i + 1;
      await category.save();
    }

    return this.model.find({ parent_collection }, null, {
      sort: { position: 'ASC' },
    });
  }
}
