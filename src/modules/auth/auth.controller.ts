import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalEmailAuthGuard } from './guard/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserWithAuthProviders } from '../user/types';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UseGuards(LocalEmailAuthGuard)
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  handleLogin(
    @Request()
    req: Request & { user: UserWithAuthProviders },
  ) {
    return this.authService.loginUser(req.user);
  }

  @Post('register')
  handleRegister(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }
}
