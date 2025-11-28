import { Injectable } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { toSlug } from 'src/common/utils/slugify';
import { PrismaService } from 'src/prisma/prisma.service';
import { Movie, Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { NotFoundException } from 'src/common/exceptions/not-found.exception';
import { BadRequestException } from 'src/common/exceptions/bad-request.exception';
import { GenreService } from '../genre/genre.service';
import { TopicService } from '../topic/topic.service';

@Injectable()
export class MovieService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly genreService: GenreService,
    private readonly topicService: TopicService,
  ) {}

  async create(createMovieDto: CreateMovieDto): Promise<Movie> {
    const { genres, topics, companies, people, franchiseId, ...movieData } =
      createMovieDto;

    const slug = toSlug(createMovieDto.title);
    const publicId = nanoid(8);

    try {
      if (genres && genres.length > 0) {
        const existingGenres = await this.genreService.findManyByIds(genres);
        const existingGenreIds = existingGenres.map((g) => g.id);
        const missingGenres = genres.filter(
          (id) => !existingGenreIds.includes(id),
        );
        if (missingGenres.length > 0) {
          throw new NotFoundException(
            `Không tìm thấy thể loại với ID: ${missingGenres.join(', ')}`,
            'GENRE_NOT_FOUND',
          );
        }
      }

      if (topics && topics.length > 0) {
        const existingTopics = await this.topicService.findManyByIds(topics);
        const existingTopicIds = existingTopics.map((t) => t.id);
        const missingTopics = topics.filter(
          (id) => !existingTopicIds.includes(id),
        );
        if (missingTopics.length > 0) {
          throw new NotFoundException(
            `Không tìm thấy chủ đề với ID: ${missingTopics.join(', ')}`,
            'TOPIC_NOT_FOUND',
          );
        }
      }

      // Validate companies nếu có
      if (companies && companies.length > 0) {
        const existingCompanies = await this.prisma.company.findMany({
          where: { id: { in: companies } },
          select: { id: true },
        });
        const existingCompanyIds = existingCompanies.map((c) => c.id);
        const missingCompanies = companies.filter(
          (id) => !existingCompanyIds.includes(id),
        );
        if (missingCompanies.length > 0) {
          throw new NotFoundException(
            `Không tìm thấy công ty với ID: ${missingCompanies.join(', ')}`,
            'COMPANY_NOT_FOUND',
          );
        }
      }

      // Validate people nếu có
      if (people && people.length > 0) {
        const peopleIds = people.map((p) => p.id);
        const existingPeople = await this.prisma.people.findMany({
          where: { id: { in: peopleIds } },
          select: { id: true },
        });
        const existingPeopleIds = existingPeople.map((p) => p.id);
        const missingPeople = peopleIds.filter(
          (id) => !existingPeopleIds.includes(id),
        );
        if (missingPeople.length > 0) {
          throw new NotFoundException(
            `Không tìm thấy người với ID: ${missingPeople.join(', ')}`,
            'PEOPLE_NOT_FOUND',
          );
        }
      }

      // Validate franchiseId nếu có
      if (franchiseId) {
        const franchise = await this.prisma.franchise.findUnique({
          where: { id: franchiseId },
        });
        if (!franchise) {
          throw new NotFoundException(
            `Không tìm thấy franchise với ID: ${franchiseId}`,
            'FRANCHISE_NOT_FOUND',
          );
        }
      }

      // Tạo movie với các relations
      return await this.prisma.movie.create({
        data: {
          slug,
          publicId,
          ...movieData,
          ...(genres && genres.length > 0
            ? {
                genres: {
                  create: genres.map((genreId) => ({
                    genre: {
                      connect: { id: genreId },
                    },
                  })),
                },
              }
            : {}),
          ...(topics && topics.length > 0
            ? {
                topics: {
                  create: topics.map((topicId) => ({
                    topic: {
                      connect: { id: topicId },
                    },
                  })),
                },
              }
            : {}),
          ...(companies && companies.length > 0
            ? {
                companies: {
                  create: companies.map((companyId) => ({
                    company: {
                      connect: { id: companyId },
                    },
                  })),
                },
              }
            : {}),
          ...(people && people.length > 0
            ? {
                peoples: {
                  create: people.map((person) => ({
                    people: {
                      connect: { id: person.id },
                    },
                    role: person.role,
                  })),
                },
              }
            : {}),
        },
      });
    } catch (error) {
      // Nếu đã là HttpException thì throw lại
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      // Xử lý lỗi Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002': {
            // Unique constraint violation
            const target = (error.meta?.target as string[]) || [];
            if (target.includes('slug')) {
              throw new BadRequestException(
                'Slug này đã tồn tại. Vui lòng thử lại với tiêu đề khác.',
                'SLUG_EXISTS',
              );
            }
            if (target.includes('publicId')) {
              throw new BadRequestException(
                'Public ID này đã tồn tại. Vui lòng thử lại.',
                'PUBLIC_ID_EXISTS',
              );
            }
            throw new BadRequestException(
              'Dữ liệu này đã tồn tại (trùng lặp).',
              'DUPLICATE_DATA',
            );
          }
          case 'P2025':
            throw new NotFoundException(
              'Không tìm thấy tài nguyên được yêu cầu.',
              'NOT_FOUND',
            );
          default:
            throw new BadRequestException(
              `Lỗi cơ sở dữ liệu: ${error.message}`,
              'DATABASE_ERROR',
            );
        }
      }

      // Lỗi không xác định
      throw new BadRequestException(
        `Lỗi khi tạo phim: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'CREATE_MOVIE_ERROR',
      );
    }
  }

  async findAll(): Promise<Movie[]> {
    return this.prisma.movie.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // findAll() {
  //   return `This action returns all movies`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} movie`;
  // }

  // // update(id: number, updateMovieDto: UpdateMovieDto) {
  // //   return `This action updates a #${id} movie`;
  // // }

  // remove(id: number) {
  //   return `This action removes a #${id} movie`;
  // }
}
