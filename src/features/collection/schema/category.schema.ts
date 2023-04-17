import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { Collection } from './collection.schema';
import { Product } from './product.schema';

export type CategoryDocument = Category & Collection & Product;

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ default: 'Untitled Category' })
  name: string;

  @Prop()
  description: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' })
  parent_collection: Collection;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const CategorySchema = createSchemaForClassWithMethods(Category);
