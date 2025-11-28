import { Module } from '@nestjs/common';
import { MovieService } from './movie.service';
import { MovieController } from './movie.controller';
import { GenreModule } from '../genre/genre.module';
import { TopicModule } from '../topic/topic.module';

@Module({
  controllers: [MovieController],
  providers: [MovieService],
  imports: [GenreModule, TopicModule],
})
export class MovieModule {}
