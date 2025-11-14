import {
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
  Get,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalEmailAuthGuard } from './guard/local-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserWithAuthProviders } from '../user/types';
import { Public } from 'src/common/decorators/public-route.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Public()
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
  @Public()
  @ApiOperation({ summary: 'Register with email and password' })
  handleRegister(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  handleGetProfile(@Request() req: Request & { user: UserWithAuthProviders }) {
    return req.user;
  }
}
