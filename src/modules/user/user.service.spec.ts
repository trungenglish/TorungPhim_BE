import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithAuthProviders } from './types';

// 1. TẠO MỘT ĐỐI TƯỢNG PRISMA GIẢ
const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// 2. TẠO MỘT SỐ DỮ LIỆU MẪU ĐỂ TEST
const mockUserWithAuthProviders: UserWithAuthProviders = {
  id: 'some-uuid-123',
  email: null,
  nickname: 'John Doe',
  username: 'john-doe',
  gender: 'MALE',
  avatarUrl: 'https://example.com/avatar.jpg',
  role: 'ADMIN',
  createdAt: new Date(),
  updatedAt: new Date(),
  AuthProvider: [
    {
      id: 'some-uuid-123',
      userId: 'some-uuid-123',
      provider: 'CREDENTIALS',
      providerUserId: null,
      passwordHash: 'password',
      refreshToken: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],
};

const mockUser: User = {
  id: 'some-uuid-123',
  email: null,
  nickname: 'John Doe',
  username: 'john-doe',
  gender: 'MALE',
  avatarUrl: 'https://example.com/avatar.jpg',
  role: 'ADMIN',
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

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  // Reset các mock sau mỗi test
  afterEach(() => {
    jest.clearAllMocks();
  });

  // === TEST HÀM CREATE ===
  describe('create', () => {
    it('should create a new userAdmin with AuthProvider', async () => {
      const createUserDto: CreateUserDto = {
        nickname: 'John Doe',
        username: 'john-doe',
        password: 'password',
        gender: 'MALE',
        avatar_url: 'https://example.com/avatar.jpg',
        role: 'ADMIN',
      };

      // Giả lập hàm create thành công
      mockPrismaService.user.create.mockResolvedValue(
        mockUserWithAuthProviders,
      );
      const result = await service.createUserAdmin(createUserDto);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          nickname: createUserDto.nickname,
          username: createUserDto.username,
          gender: createUserDto.gender,
          role: createUserDto.role,
          avatarUrl: createUserDto.avatar_url,
          AuthProvider: {
            create: {
              provider: 'CREDENTIALS', // hoặc từ DTO nếu bạn cho chọn provider
              passwordHash: expect.any(String),
            },
          },
        },
      });

      expect(result).toEqual(mockUserWithAuthProviders);
    });

    it('should throw P2002 error if user already exists', async () => {
      const createUserDto: CreateUserDto = {
        nickname: 'John Doe',
        username: 'john-doe',
        password: 'password',
        gender: 'MALE',
        avatar_url: 'https://example.com/avatar.jpg',
        role: 'ADMIN',
      };

      // Giả lập hàm create ném ra lỗi P2002
      mockPrismaService.user.create.mockRejectedValue(P2002Error);

      // Kiểm tra xem service có ném đúng lỗi P2002 ra ngoài không
      // (Để cho GlobalExceptionFilter bắt)
      await expect(service.createUserAdmin(createUserDto)).rejects.toThrow(
        P2002Error,
      );
    });
  });

  // === TEST HÀM FINDALL ===
  describe('findAll', () => {
    it('should return an array of users', async () => {
      const usersArray = [mockUser];

      mockPrismaService.user.findMany.mockResolvedValue(usersArray);
      const result = await service.findAll();

      // Kiểm tra xem prisma.findMany có được gọi với đúng orderBy
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(usersArray);
    });
  });

  // === TEST HÀM FINDBYEMAIL ===
  describe('findByEmail', () => {
    it('should return a single user by email', async () => {
      mockPrismaService.user.findUniqueOrThrow.mockResolvedValue(mockUser);

      const result = await service.findByUsername('john-doe');

      // Kiểm tra xem prisma.findUniqueOrThrow có được gọi với đúng ID
      expect(mockPrismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: 'some-uuid-123' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw P2025 error if genre not found', async () => {
      // Giả lập hàm findUniqueOrThrow ném ra lỗi P2025
      mockPrismaService.user.findUniqueOrThrow.mockRejectedValue(P2025Error);

      // Kiểm tra xem service có ném đúng lỗi ra ngoài không
      await expect(service.findByUsername('wrong-username')).rejects.toThrow(
        P2025Error,
      );
    });
  });

  // === TEST HÀM UPDATE ===
  // describe('update', () => {
  //   it('should update a profile', async () => {
  //     const updateUserDto: UpdateUserDto = {
  //       nickname: 'John Doe',
  //       username: 'john-doe',
  //       gender: 'MALE',
  //       avatar_url: 'https://example.com/avatar.jpg',
  //       role: 'ADMIN',
  //     };
  //     const expectedSlug = 'hanh-dong-moi';
  //     const updatedTopic = {
  //       ...mockTopic,
  //       ...updateTopicDto,
  //       slug: expectedSlug,
  //     };

  //     mockPrismaService.topic.update.mockResolvedValue(updatedTopic);

  //     const result = await service.update('some-uuid-123', updateTopicDto);

  //     // Kiểm tra xem prisma.update có được gọi với đúng ID và data
  //     expect(mockPrismaService.topic.update).toHaveBeenCalledWith({
  //       where: { id: 'some-uuid-123' },
  //       data: {
  //         name: updateTopicDto.name,
  //         description: updateTopicDto.description,
  //         slug: expectedSlug,
  //       },
  //     });
  //     expect(result).toEqual(updatedTopic);
  //   });

  //   it('should throw P2025 error if topic to update is not found', async () => {
  //     mockPrismaService.topic.update.mockRejectedValue(P2025Error);

  //     await expect(
  //       service.update('wrong-id', { name: 'Test' }),
  //     ).rejects.toThrow(P2025Error);
  //   });

  //   it('should throw P2002 error if updated slug conflicts', async () => {
  //     mockPrismaService.topic.update.mockRejectedValue(P2002Error);

  //     await expect(
  //       service.update('some-uuid-123', { name: 'Test' }),
  //     ).rejects.toThrow(P2002Error);
  //   });
  // });
});
