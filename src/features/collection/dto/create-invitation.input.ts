import { IsNotEmpty } from 'class-validator';

export class CreateInvitationInput {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  parent_collection: string;
}
