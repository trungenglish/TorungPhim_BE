import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

export function setupSwagger(
  app: NestExpressApplication,
  configService: ConfigService,
): void {
  const config = new DocumentBuilder()
    .setTitle(configService.get('APP_NAME', 'TorungPhim API'))
    .setDescription(
      configService.get(
        'APP_DESCRIPTION',
        'API cho trang web xem phim của Trung 🎬',
      ),
    )
    .setVersion(configService.get('APP_VERSION', '1.0'))
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer(
      configService.get('API_BASE_URL', 'http://localhost:3001'),
      'Development server',
    )
    .addServer(
      configService.get('API_PRODUCTION_URL', 'https://api.torungphim.com'),
      'Production server',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) =>
      `${controllerKey}_${methodKey}`,
  });

  SwaggerModule.setup(
    configService.get('SWAGGER_PATH', 'api/docs'),
    app,
    document,
    {
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: 'none',
        filter: true,
        showRequestHeaders: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
      },
      customSiteTitle: configService.get('APP_NAME', 'TorungPhim API'),
      customfavIcon: '/favicon.ico',
      customCss: `
        .swagger-ui .topbar { display: none }
        .swagger-ui .info .title { color: #3b82f6 }
        .swagger-ui .scheme-container { background: #f8fafc; padding: 10px; border-radius: 4px }
      `,
    },
  );
}
