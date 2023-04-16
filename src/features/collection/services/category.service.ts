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
}
