import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { Product } from './product.schema';
import { Category } from './category.schema';

export type CollectionDocument = Collection & Product;

@Schema({ timestamps: true })
export class Collection extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  background: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  //product
  //category
}

export const CollectionSchema = createSchemaForClassWithMethods(Collection);
