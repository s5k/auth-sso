import { IsEmail, IsNotEmpty, IsNumber, Max, Min } from 'class-validator';

export class VerifyAccountDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @Min(1000)
  @Max(9999)
  @IsNumber()
  code: number;
}
