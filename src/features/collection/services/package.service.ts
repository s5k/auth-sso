import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../schema/product.schema';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { BaseService } from './base.service';
import { FindProductInput } from '../dto/find-product.input';
import { CreatePackageInput } from '../dto/create-package.input';
import { UpdatePackageInput } from '../dto/update-package.input';
import { FindPackageInput } from '../dto/find-package.input';
import { Package, PackageDocument } from '../schema/package.schema';

@Injectable()
export class PackageService extends BaseService<
  Product,
  CreatePackageInput,
  UpdatePackageInput,
  FindPackageInput
> {
  constructor(
    @InjectModel(Package.name)
    private readonly packageModel: Model<PackageDocument>,
  ) {
    super(packageModel);
  }
}
