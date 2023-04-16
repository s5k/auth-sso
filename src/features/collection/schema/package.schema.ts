import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { Collection } from './collection.schema';
import { Category } from './category.schema';

export type PackageDocument = Package & Collection;

@Schema({ timestamps: true })
export class Package extends Document {
  @Prop({ default: 'Untitled package' })
  name: string;

  @Prop()
  description: string;

  @Prop()
  thumbnail: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' })
  parent_collection: Collection;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PackageCategory',
  })
  category: Category;
  //collection
  //category
}

export const PackageSchema = createSchemaForClassWithMethods(Package);
