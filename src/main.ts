import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { setupSwagger } from './config/swagger.config';
import { TransformResponseInterceptor } from './common/interceptors/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  // 🛡️ Security middleware
  app.use(helmet());
  app.enableCors({
    origin: configService.get('app.corsOrigin', '*'),
    credentials: true,
  });

  // 🌐 Prefix và version
  app.setGlobalPrefix(configService.get('app.apiPrefix', 'api'));
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: String(
      configService.get('app.apiDefaultVersion', '1'),
    ).split(','),
  });

  // 📘 Swagger setup
  setupSwagger(app, configService);

  // 🎨 Global interceptor (định dạng chuẩn mọi response)
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const port = Number(configService.get('app.port', 3001));
  await app.listen(port);

  console.log(`🚀 Application is running on: http://localhost:${port}`);
  console.log(
    `📚 Swagger docs available at: http://localhost:${port}/${configService.get('app.swaggerPath', 'api/docs')}`,
  );
}
bootstrap().catch((err) => {
  console.error('Failed to start application', err);
  process.exit(1);
});
