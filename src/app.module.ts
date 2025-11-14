import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GlobalExceptionFilter } from './common/filters/all-exception.filter';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { winstonConfig } from './config/wiston.config';
import { WinstonModule } from 'nest-winston';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { MovieModule } from './modules/movie/movie.module';
import { HealthModule } from './modules/health/health.module';
import { envConfig, appConfig } from './config/env.config';
import { PrismaModule } from './prisma/prisma.module';
import { ValidationPipe } from './common/pipes/validation.pipe';
import { GenreModule } from './modules/genre/genre.module';
import { TopicModule } from './modules/topic/topic.module';
import { JwtAuthGuard } from './modules/auth/guard/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      ...envConfig(),
      load: [appConfig],
    }),
    WinstonModule.forRootAsync(winstonConfig),
    PrismaModule,
    AuthModule,
    UserModule,
    GenreModule,
    TopicModule,
    MovieModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
