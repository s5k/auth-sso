import { CreateCollectionInput } from './create-collection.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateInvitationInput extends PartialType(CreateCollectionInput) {
  id: string;
}
