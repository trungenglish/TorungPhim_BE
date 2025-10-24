import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateGenreDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
