import { Module } from '@nestjs/common';
import { GenreService } from './genre.service';
import { GenreController } from './genre.controller';

@Module({
  controllers: [GenreController],
  providers: [GenreService], // ✅ Không cần PrismaService nữa vì đã global
  exports: [GenreService],
})
export class GenreModule {}
