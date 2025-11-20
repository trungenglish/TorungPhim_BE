import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { UserWithAuthProviders } from '../user/types';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { ConflictException } from 'src/common/exceptions/conflict.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserWithAuthProviders | null> {
    const user = await this.userService.findByEmail(email);
    if (user && user.AuthProvider.length > 0) {
      const credentialsProvider = user.AuthProvider.find(
        (provider) => provider.provider === 'CREDENTIALS',
      );
      if (credentialsProvider && credentialsProvider.passwordHash) {
        const isValid = this.isValidPassword(
          password,
          credentialsProvider.passwordHash,
        );
        if (isValid) {
          // Xóa AuthProvider đi trước khi trả về,
          // không cần thiết phải trả về hash cho Passport
          //delete user.AuthProvider;
          return user;
        }
      }
    }
    return null;
  }

  isValidPassword(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword);
  }

  loginUser(user: UserWithAuthProviders) {
    const payload = {
      email: user.email,
      sub: user.id,
      iss: 'torungphim-be',
      aud: 'torungphim-fe',
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });
    if (existingUser) {
      throw new ConflictException('User already exists with this email');
    }
    const hashedPassword = bcrypt.hashSync(registerDto.password, 10);
    return await this.prisma.user.create({
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
  }
}
