import { Test, TestingModule } from '@nestjs/testing';
import { TopicService } from './topic.service';
import { Topic, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTopicDto } from './dto/create-topic.dto';
import { toSlug } from 'src/common/utils/slugify';
import { UpdateTopicDto } from './dto/update-topic.dto';

// 1. TẠO MỘT ĐỐI TƯỢNG PRISMA GIẢ
const mockPrismaService = {
  topic: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// 2. TẠO MỘT SỐ DỮ LIỆU MẪU ĐỂ TEST
const mockTopic: Topic = {
  id: 'some-uuid-123',
  name: 'Hành động',
  description: 'Hành động là một thể loại phim',
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

describe('TopicService', () => {
  let service: TopicService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TopicService,
        // 4. Cung cấp mock service thay vì service thật
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<TopicService>(TopicService);
  });

  // Reset các mock sau mỗi test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // === TEST HÀM CREATE ===
  describe('create', () => {
    it('should create a new topic', async () => {
      const createTopicDto: CreateTopicDto = {
        name: 'Hành động',
        description: 'Hành động là một thể loại phim',
      };
      const expectedSlug = 'hanh-dong';

      // Giả lập hàm create thành công
      mockPrismaService.topic.create.mockResolvedValue(mockTopic);
      const result = await service.create(createTopicDto);

      // Kiểm tra xem hàm 'toSlug' có được gọi đúng
      expect(toSlug).toHaveBeenCalledWith(createTopicDto.name);

      // Kiểm tra xem prisma.create có được gọi với ĐÚNG dữ liệu
      expect(mockPrismaService.topic.create).toHaveBeenCalledWith({
        data: {
          name: createTopicDto.name,
          description: createTopicDto.description,
          slug: expectedSlug,
        },
      });

      // Kiểm tra kết quả trả về
      expect(result).toEqual(mockTopic);
    });

    it('should throw P2002 error if topic already exists', async () => {
      const createTopicDto: CreateTopicDto = {
        name: 'Hành động',
        description: 'Hành động là một thể loại phim',
      };

      // Giả lập hàm create ném ra lỗi P2002
      mockPrismaService.topic.create.mockRejectedValue(P2002Error);

      // Kiểm tra xem service có ném đúng lỗi P2002 ra ngoài không
      // (Để cho GlobalExceptionFilter bắt)
      await expect(service.create(createTopicDto)).rejects.toThrow(P2002Error);
    });
  });

  // === TEST HÀM FINDALL ===
  describe('findAll', () => {
    it('should return an array of topics', async () => {
      const topicsArray = [mockTopic];
      mockPrismaService.topic.findMany.mockResolvedValue(topicsArray);

      const result = await service.findAll();

      // Kiểm tra xem prisma.findMany có được gọi với đúng orderBy
      expect(mockPrismaService.topic.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(topicsArray);
    });
  });

  // === TEST HÀM FINDBYID ===
  describe('findById', () => {
    it('should return a single genre by id', async () => {
      mockPrismaService.topic.findUniqueOrThrow.mockResolvedValue(mockTopic);

      const result = await service.findById('some-uuid-123');

      // Kiểm tra xem prisma.findUniqueOrThrow có được gọi với đúng ID
      expect(mockPrismaService.topic.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 'some-uuid-123' },
      });
      expect(result).toEqual(mockTopic);
    });

    it('should throw P2025 error if genre not found', async () => {
      // Giả lập hàm findUniqueOrThrow ném ra lỗi P2025
      mockPrismaService.topic.findUniqueOrThrow.mockRejectedValue(P2025Error);

      // Kiểm tra xem service có ném đúng lỗi ra ngoài không
      await expect(service.findById('wrong-id')).rejects.toThrow(P2025Error);
    });
  });

  // === TEST HÀM UPDATE ===
  describe('update', () => {
    it('should update a topic', async () => {
      const updateTopicDto: UpdateTopicDto = { name: 'Hành động Mới' };
      const expectedSlug = 'hanh-dong-moi';
      const updatedTopic = {
        ...mockTopic,
        ...updateTopicDto,
        slug: expectedSlug,
      };

      mockPrismaService.topic.update.mockResolvedValue(updatedTopic);

      const result = await service.update('some-uuid-123', updateTopicDto);

      // Kiểm tra xem prisma.update có được gọi với đúng ID và data
      expect(mockPrismaService.topic.update).toHaveBeenCalledWith({
        where: { id: 'some-uuid-123' },
        data: {
          name: updateTopicDto.name,
          description: updateTopicDto.description,
          slug: expectedSlug,
        },
      });
      expect(result).toEqual(updatedTopic);
    });

    it('should throw P2025 error if topic to update is not found', async () => {
      mockPrismaService.topic.update.mockRejectedValue(P2025Error);

      await expect(
        service.update('wrong-id', { name: 'Test' }),
      ).rejects.toThrow(P2025Error);
    });

    it('should throw P2002 error if updated slug conflicts', async () => {
      mockPrismaService.topic.update.mockRejectedValue(P2002Error);

      await expect(
        service.update('some-uuid-123', { name: 'Test' }),
      ).rejects.toThrow(P2002Error);
    });
  });

  // === TEST HÀM REMOVE ===
  describe('remove', () => {
    it('should remove a genre', async () => {
      mockPrismaService.topic.delete.mockResolvedValue(mockTopic);

      const result = await service.remove('some-uuid-123');
      // Kiểm tra xem prisma.delete có được gọi với đúng ID
      expect(mockPrismaService.topic.delete).toHaveBeenCalledWith({
        where: { id: 'some-uuid-123' },
      });
      expect(result).toEqual(mockTopic);
    });

    it('should throw P2025 error if genre to remove is not found', async () => {
      mockPrismaService.topic.delete.mockRejectedValue(P2025Error);

      await expect(service.remove('wrong-id')).rejects.toThrow(P2025Error);
    });
  });
});
