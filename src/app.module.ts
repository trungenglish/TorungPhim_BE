import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/all-exception.filter';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { winstonConfig } from './config/wiston.config';
import { WinstonModule } from 'nest-winston';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MoviesModule } from './modules/movies/movies.module';
import { HealthModule } from './modules/health/health.module';
import { envConfig, appConfig } from './config/env.config';
import { PrismaService } from './prisma/prisma.service';
import { ValidationPipe } from './common/pipes/validation.pipe';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...envConfig(),
      load: [appConfig],
    }),
    WinstonModule.forRootAsync(winstonConfig),
    AuthModule,
    UsersModule,
    MoviesModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
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
