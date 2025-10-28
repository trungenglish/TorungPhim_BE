import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { toSlug } from 'src/common/utils/slugify';
import { Topic } from '@prisma/client';

/**
 * Service để quản lý Chủ đề (Topic).
 *
 * LƯU Ý: Các hàm CRUD không dùng 'try...catch' vì các lỗi Prisma đã biết
 * (ví dụ: P2002 - Trùng lặp do @unique, hoặc P2025 - Không tìm thấy)
 * đã được tự động bắt và xử lý bởi 'GlobalExceptionFilter'.
 * các trường hợp đặc biệt có thể dùng try...catch để xử lý
 */

@Injectable()
export class TopicService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const slug = toSlug(createTopicDto.name);

    return this.prisma.topic.create({
      data: {
        name: createTopicDto.name,
        description: createTopicDto.description,
        slug: slug,
      },
    });
  }

  findAll(): Promise<Topic[]> {
    return this.prisma.topic.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findById(id: string): Promise<Topic> {
    return this.prisma.topic.findUniqueOrThrow({
      where: { id: id },
    });
  }

  update(id: string, updateTopicDto: UpdateTopicDto) {
    const data = {
      ...(updateTopicDto.name !== undefined && { name: updateTopicDto.name }),
      ...(updateTopicDto.description !== undefined && {
        description: updateTopicDto.description,
      }),
      ...(updateTopicDto.name !== undefined && {
        slug: toSlug(updateTopicDto.name),
      }),
    };

    return this.prisma.topic.update({
      where: { id: id },
      data,
    });
  }

  remove(id: string) {
    return this.prisma.topic.delete({
      where: { id: id },
    });
  }
}
