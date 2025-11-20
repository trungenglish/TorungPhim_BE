import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserRole, Gender } from '@prisma/client';
import { UserWithAuthProviders } from './types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// 1. TẠO MỘT SERVICE GIẢ
const mockUserService = {
  findAll: jest.fn(),
  findByEmail: jest.fn(),
  createUserAdmin: jest.fn(),
  updateProfile: jest.fn(),
};

// 2. TẠO DỮ LIỆU MẪU
const mockUser: User = {
  id: 'user-uuid-123',
  nickname: 'John Doe',
  username: 'johndoe',
  email: null,
  gender: Gender.MALE,
  avatarUrl: 'https://example.com/avatar.jpg',
  role: UserRole.USER,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

const mockUserWithAuthProviders: UserWithAuthProviders = {
  ...mockUser,
  AuthProvider: [
    {
      id: 'auth-provider-uuid-123',
      userId: 'user-uuid-123',
      provider: 'CREDENTIALS',
      providerUserId: null,
      passwordHash: 'hashed-password',
      refreshToken: null,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
  ],
};

const mockAdminUser: User = {
  ...mockUser,
  id: 'admin-uuid-456',
  username: 'admin',
  email: 'admin@example.com',
  role: UserRole.ADMIN,
};

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  // 4. DỌN DẸP
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // === TEST HÀM FINDALL (GET /user) ===
  describe('handleFindAll', () => {
    it('should call service.findAll and return array of users', async () => {
      const usersArray = [mockUser, mockAdminUser];
      mockUserService.findAll.mockResolvedValue(usersArray);

      const result = await controller.handleFindAll();

      // Kiểm tra: Hàm mock 'findAll' có được gọi không?
      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
      // Kiểm tra: Kết quả trả về có đúng là mảng users không?
      expect(result).toEqual(usersArray);
    });

    it('should return empty array when no users exist', async () => {
      mockUserService.findAll.mockResolvedValue([]);

      const result = await controller.handleFindAll();

      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });
  });

  // === TEST HÀM FINDBYEMAIL (GET /user/email/:email) ===
  describe('handleFindByEmail', () => {
    it('should call service.findByEmail with the correct email', async () => {
      const email = 'john@example.com';
      mockUserService.findByEmail.mockResolvedValue(mockUserWithAuthProviders);

      const result = await controller.handleFindByEmail(email);

      // Kiểm tra: Hàm mock 'findByEmail' có được gọi VỚI 'email' không?
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(mockUserService.findByEmail).toHaveBeenCalledTimes(1);
      // Kiểm tra: Kết quả trả về có đúng không?
      expect(result).toEqual(mockUserWithAuthProviders);
    });

    it('should return null when user not found', async () => {
      const email = 'notfound@example.com';
      mockUserService.findByEmail.mockResolvedValue(null);

      const result = await controller.handleFindByEmail(email);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toBeNull();
    });
  });

  // === TEST HÀM CREATEUSERADMIN (POST /user/create-admin) ===
  describe('handleCreateUserAdmin', () => {
    it('should call service.createUserAdmin with the correct DTO', async () => {
      const dto: CreateUserDto = {
        nickname: 'Admin User',
        username: 'adminuser',
        password: 'password123',
        gender: Gender.MALE,
        avatar_url: 'https://example.com/admin.jpg',
        role: UserRole.ADMIN,
      };

      mockUserService.createUserAdmin.mockResolvedValue(mockAdminUser);

      const result = await controller.handleCreateUserAdmin(dto);

      // Kiểm tra: Hàm mock 'createUserAdmin' có được gọi VỚI 'dto' không?
      expect(mockUserService.createUserAdmin).toHaveBeenCalledWith(dto);
      expect(mockUserService.createUserAdmin).toHaveBeenCalledTimes(1);
      // Kiểm tra: Controller có trả về đúng thứ mà service đã đưa không?
      expect(result).toEqual(mockAdminUser);
    });

    it('should create admin user without avatar_url', async () => {
      const dto: CreateUserDto = {
        nickname: 'Admin User',
        username: 'adminuser2',
        password: 'password123',
        gender: Gender.FEMALE,
        role: UserRole.ADMIN,
      };

      const createdUser = { ...mockAdminUser, avatarUrl: null };
      mockUserService.createUserAdmin.mockResolvedValue(createdUser);

      const result = await controller.handleCreateUserAdmin(dto);

      expect(mockUserService.createUserAdmin).toHaveBeenCalledWith(dto);
      expect(result).toEqual(createdUser);
    });
  });

  // === TEST HÀM UPDATEPROFILE (PATCH /user/:id) ===
  describe('handleUpdateProfile', () => {
    it('should call service.updateProfile with correct id and DTO', async () => {
      const id = 'user-uuid-123';
      const dto: UpdateUserDto = {
        nickname: 'Updated Name',
        gender: Gender.FEMALE,
        avatar_url: 'https://example.com/new-avatar.jpg',
        role: UserRole.USER,
      };
      const updatedUser = { ...mockUser, ...dto };

      mockUserService.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.handleUpdateProfile(id, dto);

      // Kiểm tra: Hàm mock 'updateProfile' có được gọi VỚI 'id' và 'dto' không?
      expect(mockUserService.updateProfile).toHaveBeenCalledWith(id, dto);
      expect(mockUserService.updateProfile).toHaveBeenCalledTimes(1);
      // Kiểm tra: Kết quả trả về có đúng không?
      expect(result).toEqual(updatedUser);
    });

    it('should update only nickname', async () => {
      const id = 'user-uuid-123';
      const dto: UpdateUserDto = {
        nickname: 'New Nickname',
        gender: Gender.MALE,
        role: UserRole.USER,
      };
      const updatedUser = { ...mockUser, nickname: 'New Nickname' };

      mockUserService.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.handleUpdateProfile(id, dto);

      expect(mockUserService.updateProfile).toHaveBeenCalledWith(id, dto);
      expect(result.nickname).toBe('New Nickname');
    });
  });
});
