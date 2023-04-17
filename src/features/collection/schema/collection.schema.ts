import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { createSchemaForClassWithMethods } from '../../../shared/mongoose/create-schema';
import { Product } from './product.schema';
import { User } from 'src/features/user/schema/user.schema';

export type CollectionDocument = Collection & Product;

@Schema({ timestamps: true })
export class Collection extends Document {
  @Prop({ default: 'Untitled Collection' })
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

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  members: User[];

  //product
  //category
}

export const CollectionSchema = createSchemaForClassWithMethods(Collection);
