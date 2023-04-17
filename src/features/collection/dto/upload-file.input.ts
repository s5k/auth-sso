import { IsNotEmpty, IsString } from 'class-validator';

export class UploadFileInput {
  @IsNotEmpty()
  image: string;
}
