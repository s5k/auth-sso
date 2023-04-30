import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Product,
  ProductDocument,
  ProductStatus,
} from '../schema/product.schema';
import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { BaseService } from './base.service';
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
  ) {
    super(productModel);
  }

  async findAll(findInput: FindProductInput): Promise<Product[]> {
    const results = await this.model.find(findInput, null, {
      sort: { position: 'ASC' },
    });

    if (!results) {
      return [];
    }

    return results;
  }

  async count(collectionId: String) {
    const results = await this.model.find({
      parent_collection: collectionId,
    });

    if (!results) {
      return {
        productInDesign: 0,
        productInSourcing: 0,
        productInSampling: 0,
        productInFinalProduction: 0,
        productInTakeDelivery: 0,
        totalProducts: 0,
      };
    }

    const productInDesign = results.filter(
      product => product.status === ProductStatus.IN_DESIGN,
    ).length;
    const productInSourcing = results.filter(
      product => product.status === ProductStatus.IN_SOURCING,
    ).length;
    const productInSampling = results.filter(
      product => product.status === ProductStatus.IN_SAMPLING,
    ).length;
    const productInFinalProduction = results.filter(
      product => product.status === ProductStatus.IN_FINAL_PRODUCTION,
    ).length;
    const productInTakeDelivery = results.filter(
      product => product.status === ProductStatus.TAKE_DELIVERY,
    ).length;
    const totalProducts = results.length;

    return {
      productInDesign,
      productInSourcing,
      productInSampling,
      productInFinalProduction,
      productInTakeDelivery,
      totalProducts,
    };
  }

  async rearrageProduct(
    productId: string,
    position: number,
  ): Promise<Product[]> {
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
