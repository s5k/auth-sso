import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class InviteMemberInput {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  collectionId: string;
}
