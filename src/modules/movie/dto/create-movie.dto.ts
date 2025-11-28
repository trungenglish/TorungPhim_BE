import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  Min,
  Max,
  IsNumber,
  ArrayNotEmpty,
  IsArray,
  IsUUID,
} from 'class-validator';
import { MovieStatus, MovieType, RolePeople } from '@prisma/client';

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  originalTitle?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(MovieType)
  type: MovieType;

  @IsOptional()
  @IsInt()
  @Min(1)
  duration?: number;

  @IsOptional()
  @IsEnum(MovieStatus)
  status?: MovieStatus;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(0)
  @Max(10)
  imdbRating?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  subtitledCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  dubbedCount?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  voiceoverCount?: number;

  @IsOptional()
  @IsString()
  franchiseId?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  partNumber?: number;

  @IsOptional()
  @IsArray()
  people?: {
    id: string;
    role: RolePeople;
  }[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  genres?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  topics?: string[];

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  companies?: string[];
}
