import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // Security
  app.use(helmet());
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    credentials: true,
  });

  // Global prefix and versioning
  app.setGlobalPrefix(configService.get('API_PREFIX', 'api'));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: String(configService.get('API_DEFAULT_VERSION', '1')).split(
      ',',
    ),
  });

  // Swagger documentation
  setupSwagger(app, configService);

  // Start server
  const port = Number(configService.get('PORT', 3001));
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 Swagger docs available at: http://localhost:${port}/${configService.get('SWAGGER_PATH', 'api/docs')}`,
  );
}
bootstrap().catch((err) => {
  console.error('Failed to start application', err);
  process.exit(1);
});
