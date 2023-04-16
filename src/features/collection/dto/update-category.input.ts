import { CreateCollectionInput } from './create-collection.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateCategoryInput extends PartialType(CreateCollectionInput) {
  id: string;
}
