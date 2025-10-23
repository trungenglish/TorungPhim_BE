import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { PrismaService } from 'src/prisma/prisma.service'; // Import thật
import { Genre, Prisma } from '@prisma/client';
import { CreateGenreDto } from './dto/create-genre.dto';
import { toSlug } from 'src/common/utils/slugify';
import { UpdateGenreDto } from './dto/update-genre.dto';

// 1. TẠO MỘT ĐỐI TƯỢNG PRISMA GIẢ
const mockPrismaService = {
  genre: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// 2. TẠO MỘT SỐ DỮ LIỆU MẪU ĐỂ TEST
const mockGenre: Genre = {
  id: 'some-uuid-123',
  name: 'Hành động',
  slug: 'hanh-dong',
  createdAt: new Date(),
};

// 3. TẠO CÁC LỖI PRISMA GIẢ
const P2002Error = new Prisma.PrismaClientKnownRequestError(
  'Unique constraint failed',
  {
    code: 'P2002',
    clientVersion: 'x.y.z',
  },
);

const P2025Error = new Prisma.PrismaClientKnownRequestError(
  'Record not found',
  {
    code: 'P2025',
    clientVersion: 'x.y.z',
  },
);

// Mock hàm toSlug
jest.mock('src/common/utils/slugify', () => ({
  toSlug: jest.fn((text: string) => {
    if (!text) return '';
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a')
      .replace(/[èéẹẻẽêềếệểễ]/g, 'e')
      .replace(/[ìíịỉĩ]/g, 'i')
      .replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o')
      .replace(/[ùúụủũưừứựửữ]/g, 'u')
      .replace(/[ỳýỵỷỹ]/g, 'y')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9-]/g, '');
  }),
}));

describe('GenreService', () => {
  let service: GenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenreService,
        // 4. Cung cấp mock service thay vì service thật
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<GenreService>(GenreService);
  });

  // Reset các mock sau mỗi test
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // === TEST HÀM CREATE ===
  describe('create', () => {
    it('should create a new genre', async () => {
      const createGenreDto: CreateGenreDto = { name: 'Hành động' };
      const expectedSlug = 'hanh-dong';

      // Giả lập hàm create thành công
      mockPrismaService.genre.create.mockResolvedValue(mockGenre);

      const result = await service.create(createGenreDto);

      // Kiểm tra xem hàm 'toSlug' có được gọi đúng
      expect(toSlug).toHaveBeenCalledWith(createGenreDto.name);

      // Kiểm tra xem prisma.create có được gọi với ĐÚNG dữ liệu
      expect(mockPrismaService.genre.create).toHaveBeenCalledWith({
        data: {
          name: createGenreDto.name,
          slug: expectedSlug,
        },
      });

      // Kiểm tra kết quả trả về
      expect(result).toEqual(mockGenre);
    });

    it('should throw P2002 error if genre already exists', async () => {
      const createGenreDto: CreateGenreDto = { name: 'Hành động' };

      // Giả lập hàm create ném ra lỗi P2002
      mockPrismaService.genre.create.mockRejectedValue(P2002Error);

      // Kiểm tra xem service có ném đúng lỗi P2002 ra ngoài không
      // (Để cho GlobalExceptionFilter bắt)
      await expect(service.create(createGenreDto)).rejects.toThrow(P2002Error);
    });
  });

  // === TEST HÀM FINDALL ===
  describe('findAll', () => {
    it('should return an array of genres', async () => {
      const genresArray = [mockGenre];
      mockPrismaService.genre.findMany.mockResolvedValue(genresArray);

      const result = await service.findAll();

      // Kiểm tra xem prisma.findMany có được gọi với đúng orderBy
      expect(mockPrismaService.genre.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(genresArray);
    });
  });

  // === TEST HÀM FINDBYID ===
  describe('findById', () => {
    it('should return a single genre by id', async () => {
      mockPrismaService.genre.findUniqueOrThrow.mockResolvedValue(mockGenre);

      const result = await service.findById('some-uuid-123');

      // Kiểm tra xem prisma.findUniqueOrThrow có được gọi với đúng ID
      expect(mockPrismaService.genre.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 'some-uuid-123' },
      });
      expect(result).toEqual(mockGenre);
    });

    it('should throw P2025 error if genre not found', async () => {
      // Giả lập hàm findUniqueOrThrow ném ra lỗi P2025
      mockPrismaService.genre.findUniqueOrThrow.mockRejectedValue(P2025Error);

      // Kiểm tra xem service có ném đúng lỗi ra ngoài không
      await expect(service.findById('wrong-id')).rejects.toThrow(P2025Error);
    });
  });

  // === TEST HÀM UPDATE ===
  describe('update', () => {
    it('should update a genre', async () => {
      const updateGenreDto: UpdateGenreDto = { name: 'Hành động Mới' };
      const expectedSlug = 'hanh-dong-moi';
      const updatedGenre = {
        ...mockGenre,
        ...updateGenreDto,
        slug: expectedSlug,
      };

      mockPrismaService.genre.update.mockResolvedValue(updatedGenre);

      const result = await service.update('some-uuid-123', updateGenreDto);

      // Kiểm tra xem prisma.update có được gọi với đúng ID và data
      expect(mockPrismaService.genre.update).toHaveBeenCalledWith({
        where: { id: 'some-uuid-123' },
        data: {
          name: updateGenreDto.name,
          slug: expectedSlug,
        },
      });
      expect(result).toEqual(updatedGenre);
    });

    it('should throw P2025 error if genre to update is not found', async () => {
      mockPrismaService.genre.update.mockRejectedValue(P2025Error);

      await expect(
        service.update('wrong-id', { name: 'Test' }),
      ).rejects.toThrow(P2025Error);
    });

    it('should throw P2002 error if updated slug conflicts', async () => {
      mockPrismaService.genre.update.mockRejectedValue(P2002Error);

      await expect(
        service.update('some-uuid-123', { name: 'Test' }),
      ).rejects.toThrow(P2002Error);
    });
  });

  // === TEST HÀM REMOVE ===
  describe('remove', () => {
    it('should remove a genre', async () => {
      mockPrismaService.genre.delete.mockResolvedValue(mockGenre);

      const result = await service.remove('some-uuid-123');
      // Kiểm tra xem prisma.delete có được gọi với đúng ID
      expect(mockPrismaService.genre.delete).toHaveBeenCalledWith({
        where: { id: 'some-uuid-123' },
      });
      expect(result).toEqual(mockGenre);
    });

    it('should throw P2025 error if genre to remove is not found', async () => {
      mockPrismaService.genre.delete.mockRejectedValue(P2025Error);

      await expect(service.remove('wrong-id')).rejects.toThrow(P2025Error);
    });
  });
});
