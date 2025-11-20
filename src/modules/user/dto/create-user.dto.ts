import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Gender, UserRole } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  nickname: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @Transform(({ value }: { value: string }) => value.toUpperCase())
  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  avatar_url?: string;

  @Transform(({ value }: { value: string }) => value.toUpperCase())
  @IsEnum(UserRole)
  role: UserRole;
}
