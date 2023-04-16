import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category, CategoryDocument } from '../schema/category.schema';
import { CreateCategoryInput } from '../dto/create-category.input';
import { UpdateCategoryInput } from '../dto/update-category.input';
import { BaseService } from './base.service';
import { FindCategoryInput } from '../dto/find-category.input';
import { CreatePackageCategoryInput } from '../dto/create-package-category.input';
import { UpdatePackageCategoryInput } from '../dto/update-package-category.input';
import { FindPackageCategoryInput } from '../dto/find-package-category.input';
import {
  PackageCategory,
  PackageCategoryDocument,
} from '../schema/package-category.schema';

@Injectable()
export class PackageCategoryService extends BaseService<
  Category,
  CreatePackageCategoryInput,
  UpdatePackageCategoryInput,
  FindPackageCategoryInput
> {
  constructor(
    @InjectModel(PackageCategory.name)
    private readonly packageCategoryModel: Model<PackageCategoryDocument>,
  ) {
    super(packageCategoryModel);
  }
}
