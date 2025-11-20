import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { UserWithAuthProviders } from '../user/types';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { ConflictException } from 'src/common/exceptions/conflict.exception';

const mockPrismaService = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
};

const mockJwtService = {
  sign: jest.fn(),
};

const mockUserService = {
  findByEmail: jest.fn(),
};

const mockUser: UserWithAuthProviders = {
  id: 'user-id',
  email: 'john@example.com',
  nickname: 'John',
  username: 'johnny',
  gender: 'MALE',
  avatarUrl: 'https://example.com/avatar.png',
  role: 'USER',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
  updatedAt: new Date('2024-01-01T00:00:00.000Z'),
  AuthProvider: [
    {
      id: 'provider-id',
      userId: 'user-id',
      provider: 'CREDENTIALS',
      providerUserId: null,
      passwordHash: 'hashed-password',
      refreshToken: null,
      createdAt: new Date('2024-01-01T00:00:00.000Z'),
      updatedAt: new Date('2024-01-01T00:00:00.000Z'),
    },
  ],
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  describe('validateUser', () => {
    it('should return user when password is valid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      const spy = jest.spyOn(service, 'isValidPassword').mockReturnValue(true);

      const result = await service.validateUser('john@example.com', 'secret');

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(
        'john@example.com',
      );
      expect(spy).toHaveBeenCalledWith('secret', 'hashed-password');
      expect(result).toEqual(mockUser);
    });

    it('should return null when password is invalid', async () => {
      mockUserService.findByEmail.mockResolvedValue(mockUser);
      jest.spyOn(service, 'isValidPassword').mockReturnValue(false);

      const result = await service.validateUser('john@example.com', 'wrong');

      expect(result).toBeNull();
    });

    it('should return null when user not found', async () => {
      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await service.validateUser('notfound@example.com', 'pw');

      expect(result).toBeNull();
    });
  });

  describe('isValidPassword', () => {
    it('should delegate to bcrypt.compareSync', () => {
      const spy = jest.spyOn(bcrypt, 'compareSync').mockReturnValue(true);

      const result = service.isValidPassword('plain', 'hash');

      expect(spy).toHaveBeenCalledWith('plain', 'hash');
      expect(result).toBe(true);
    });
  });

  describe('loginUser', () => {
    it('should sign jwt with payload and return access token', () => {
      mockJwtService.sign.mockReturnValue('signed-token');

      const result = service.loginUser(mockUser);

      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        iss: 'torungphim-be',
        aud: 'torungphim-fe',
        role: mockUser.role,
      });
      expect(result).toEqual({ access_token: 'signed-token' });
    });
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'new@example.com',
      nickname: 'New User',
      password: 'StrongPass!23',
    };

    it('should throw ConflictException when email exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({ id: 'existing' });

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });

    it('should create user with hashed password when email is new', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      const hashedPassword = 'hashed-pass';
      jest.spyOn(bcrypt, 'hashSync').mockReturnValue(hashedPassword);
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hashSync).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          nickname: registerDto.nickname,
          gender: 'OTHER',
          role: 'USER',
          AuthProvider: {
            create: {
              provider: 'CREDENTIALS',
              passwordHash: hashedPassword,
            },
          },
        },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
