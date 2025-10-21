import { Injectable } from '@nestjs/common';

import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toSlug } from 'src/common/utils/slugify';
import { Genre } from '@prisma/client';

/**
 * Service để quản lý Thể loại (Genre).
 *
 * LƯU Ý: Các hàm CRUD không dùng 'try...catch' vì các lỗi Prisma đã biết
 * (ví dụ: P2002 - Trùng lặp do @unique, hoặc P2025 - Không tìm thấy)
 * đã được tự động bắt và xử lý bởi 'GlobalExceptionFilter'.
 */

@Injectable()
export class GenreService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createGenreDto: CreateGenreDto): Promise<Genre> {
    const slug = toSlug(createGenreDto.name);

    return await this.prisma.genre.create({
      data: {
        name: createGenreDto.name,
        slug: slug,
      },
    });
  }

  async findAll(): Promise<Genre[]> {
    return await this.prisma.genre.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<Genre> {
    return await this.prisma.genre.findUniqueOrThrow({
      where: { id: id },
    });
  }

  async update(id: string, updateGenreDto: UpdateGenreDto) {
    return await this.prisma.genre.update({
      where: { id: id },
      data: {
        name: updateGenreDto.name,
        slug: toSlug(updateGenreDto.name),
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.genre.delete({
      where: { id: id },
    });
  }
}
