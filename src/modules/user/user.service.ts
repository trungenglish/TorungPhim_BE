import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserWithAuthProviders } from './types';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { hashPassword } from 'src/common/utils/password';

/**
 * Service để quản lý Người dùng (User).
 *
 * LƯU Ý: Các hàm CRUD không dùng 'try...catch' vì các lỗi Prisma đã biết
 * (ví dụ: P2002 - Trùng lặp do @unique, hoặc P2025 - Không tìm thấy)
 * đã được tự động bắt và xử lý bởi 'GlobalExceptionFilter'.
 * các trường hợp đặc biệt có thể dùng try...catch để xử lý
 */

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByEmail(email: string): Promise<UserWithAuthProviders | null> {
    return await this.prisma.user.findUniqueOrThrow({
      where: { email: email },
      include: {
        AuthProvider: true,
      },
    });
  }

  async findByUsername(
    username: string,
  ): Promise<UserWithAuthProviders | null> {
    return this.prisma.user.findUnique({
      where: { username },
      include: {
        AuthProvider: true,
      },
    });
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    return await this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  async createUserAdmin(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = hashPassword(createUserDto.password);

    return await this.prisma.user.create({
      data: {
        nickname: createUserDto.nickname,
        username: createUserDto.username,
        gender: createUserDto.gender,
        avatarUrl: createUserDto.avatar_url,
        role: createUserDto.role,
        AuthProvider: {
          create: {
            provider: 'CREDENTIALS',
            passwordHash: hashedPassword,
          },
        },
      },
    });
  }
}
