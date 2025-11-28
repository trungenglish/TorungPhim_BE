import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { CompanyType } from '@prisma/client';

export class CreateCompanyDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(CompanyType)
  type: CompanyType;

  @IsString()
  @IsNotEmpty()
  country: string;
}
