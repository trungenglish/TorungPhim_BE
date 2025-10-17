import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/all-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { winstonConfig } from './config/wiston.config';
import { WinstonModule } from 'nest-winston';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MoviesModule } from './modules/movies/movies.module';
import { envConfig } from './config/env.config';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(envConfig()),
    WinstonModule.forRootAsync(winstonConfig),
    AuthModule,
    UsersModule,
    MoviesModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    PrismaService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
