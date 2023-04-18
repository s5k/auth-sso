import { Prop, Schema } from '@nestjs/mongoose';
import mongoose, { Collection, Document } from 'mongoose';
import { createSchemaForClassWithMethods } from 'src/shared/mongoose/create-schema';

export type InvitationDocument = Invitation & Collection;

@Schema({ timestamps: true })
export class Invitation extends Document {
  @Prop()
  email: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Collection' })
  parent_collection: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const InvitationSchema = createSchemaForClassWithMethods(Invitation);
