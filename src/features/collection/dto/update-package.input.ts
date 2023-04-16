import { CreateCollectionInput } from './create-collection.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePackageInput extends PartialType(CreateCollectionInput) {
  id: string;
}
