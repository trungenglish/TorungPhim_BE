import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserWithAuthProviders } from '../user/types';
import { RegisterDto } from './dto/register.dto';

const mockAuthService = {
  loginUser: jest.fn(),
  register: jest.fn(),
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

describe('AuthController', () => {
  let controller: AuthController;
  type AuthenticatedRequest = Parameters<AuthController['handleLogin']>[0];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleLogin', () => {
    it('should call authService.loginUser with request user', () => {
      const mockResponse = { access_token: 'token' };
      mockAuthService.loginUser.mockReturnValue(mockResponse);

      const req = { user: mockUser } as unknown as AuthenticatedRequest;

      const result = controller.handleLogin(req);

      expect(mockAuthService.loginUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('handleRegister', () => {
    it('should call authService.register with dto', async () => {
      const registerDto = {
        email: 'new@example.com',
        nickname: 'New User',
        password: 'StrongPass!23',
      } as RegisterDto;
      const createdUser = { ...mockUser, email: registerDto.email };
      mockAuthService.register.mockResolvedValue(createdUser);

      const result = await controller.handleRegister(registerDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(createdUser);
    });
  });

  describe('handleGetProfile', () => {
    it('should return current user from request', () => {
      const req = { user: mockUser } as unknown as AuthenticatedRequest;

      const result = controller.handleGetProfile(req);

      expect(result).toEqual(mockUser);
    });
  });
});
