import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
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
  Package,
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

  findAll(findInput: FindPackageInput): Promise<Package[]> {
    return this.model.find(findInput, null, { sort: { position: 'ASC' } });
  }

  async rearrageProduct(
    productId: string,
    position: number,
  ): Promise<Package[]> {
    const product = await this.model.findById(productId);

    if (!product) {
      return null;
    }

    const { parent_collection, category } = product;

    const products = await this.model.find(
      {
        parent_collection,
        category: category || null,
      },
      null,
      { sort: { position: 'ASC' } },
    );

    if (!products) {
      return null;
    }

    // Locate the product that we want to move
    const productToMove = products.find(
      product => product._id.toString() === productId,
    );

    if (!productToMove) {
      return null;
    }

    // Remove the product from the list
    const indexToRemove = products.indexOf(productToMove);
    products.splice(indexToRemove, 1);

    // Insert the product back into the list at the desired position
    products.splice(position - 1, 0, productToMove);

    // Update the positions of the remaining products in the list
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      product.position = i + 1;
      await product.save();
    }

    return this.model.find(
      { parent_collection, category: category || null },
      null,
      { sort: { position: 'ASC' } },
    );
  }
}
