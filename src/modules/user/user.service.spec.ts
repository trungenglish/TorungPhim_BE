import { Test, TestingModule } from '@nestjs/testing';
import { Prisma, Provider, User } from '@prisma/client';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserWithAuthProviders } from './types';
import { UpdateUserDto } from './dto/update-user.dto';

const mockPrismaService = {
  user: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUniqueOrThrow: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockAuthProvider = {
  id: 'auth-provider-id',
  userId: 'user-id',
  provider: Provider.CREDENTIALS,
  providerUserId: null,
  passwordHash: 'hashed-password',
  refreshToken: null,
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

const mockUser: User = {
  id: 'user-id',
  email: 'john@example.com',
  nickname: 'John',
  username: 'johnny',
  gender: 'MALE',
  avatarUrl: 'https://example.com/avatar.png',
  role: 'ADMIN',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
};

const mockUserWithAuthProviders: UserWithAuthProviders = {
  ...mockUser,
  AuthProvider: [mockAuthProvider],
};

const P2002Error = new Prisma.PrismaClientKnownRequestError(
  'Unique constraint failed',
  { code: 'P2002', clientVersion: 'x.y.z' },
);

const P2025Error = new Prisma.PrismaClientKnownRequestError(
  'Record not found',
  { code: 'P2025', clientVersion: 'x.y.z' },
);

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUserAdmin', () => {
    const dto: CreateUserDto = {
      nickname: 'John',
      username: 'johnny',
      password: 'StrongPass!23',
      gender: 'MALE',
      avatar_url: 'https://example.com/avatar.png',
      role: 'ADMIN',
    };

    it('should create user with hashed password and relations', async () => {
      mockPrismaService.user.create.mockResolvedValue(
        mockUserWithAuthProviders,
      );

      const result = await service.createUserAdmin(dto);

      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          nickname: dto.nickname,
          username: dto.username,
          gender: dto.gender,
          role: dto.role,
          avatarUrl: dto.avatar_url,
          AuthProvider: {
            create: {
              provider: Provider.CREDENTIALS,
              passwordHash: expect.any(String) as string,
            },
          },
        },
      });
      expect(result).toEqual(mockUserWithAuthProviders);
    });

    it('should bubble up Prisma errors', async () => {
      mockPrismaService.user.create.mockRejectedValue(P2002Error);

      await expect(service.createUserAdmin(dto)).rejects.toThrow(P2002Error);
    });
  });

  describe('findAll', () => {
    it('should return users sorted by createdAt desc', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);

      const result = await service.findAll();

      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findByEmail', () => {
    it('should return user with relations', async () => {
      mockPrismaService.user.findUniqueOrThrow.mockResolvedValue(
        mockUserWithAuthProviders,
      );

      const result = await service.findByEmail('john@example.com');

      expect(mockPrismaService.user.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        include: { AuthProvider: true },
      });
      expect(result).toEqual(mockUserWithAuthProviders);
    });

    it('should bubble up Prisma errors', async () => {
      mockPrismaService.user.findUniqueOrThrow.mockRejectedValue(P2025Error);

      await expect(service.findByEmail('notfound@example.com')).rejects.toThrow(
        P2025Error,
      );
    });
  });

  describe('findByUsername', () => {
    it('should return user by username', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(
        mockUserWithAuthProviders,
      );

      const result = await service.findByUsername('johnny');

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'johnny' },
        include: { AuthProvider: true },
      });
      expect(result).toEqual(mockUserWithAuthProviders);
    });
  });

  describe('updateProfile', () => {
    const dto: UpdateUserDto = {
      nickname: 'Updated John',
      gender: 'MALE',
      avatar_url: 'https://example.com/new-avatar.png',
      role: 'ADMIN',
    };

    it('should update user by id', async () => {
      const updatedUser = { ...mockUser, nickname: dto.nickname };
      mockPrismaService.user.update.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('user-id', dto);

      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        where: { id: 'user-id' },
        data: dto,
      });
      expect(result).toEqual(updatedUser);
    });
  });
});
