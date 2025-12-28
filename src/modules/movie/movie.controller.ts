import { Body, Controller, Get, Post } from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { Movie } from '@prisma/client';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  async create(@Body() createMovieDto: CreateMovieDto): Promise<Movie> {
    return this.movieService.create(createMovieDto);
  }

  @Get()
  async findAll(): Promise<Movie[]> {
    const movies = await this.movieService.findAll();
    return movies;
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.movieService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateMovieDto: UpdateMovieDto) {
  //   return this.moviesService.update(+id, updateMovieDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.movieService.remove(+id);
  // }
}
