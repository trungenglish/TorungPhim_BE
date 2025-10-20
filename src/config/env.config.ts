import { registerAs } from '@nestjs/config';

export const envConfig = registerAs('env', () => ({
  envFilePath: '.env',
  isGlobal: true,
  // cache: true,
  // expandVariables: true,
  // validationSchema: null,
}));

export const appConfig = registerAs('app', () => ({
  port: process.env.PORT || 3001,
  apiPrefix: process.env.API_PREFIX || 'api',
  apiDefaultVersion: process.env.API_DEFAULT_VERSION || '1',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  swaggerPath: process.env.SWAGGER_PATH || 'api/docs',
  appName: process.env.APP_NAME || 'TorungPhim API',
  appDescription:
    process.env.APP_DESCRIPTION || 'API cho trang web xem phim của Trung 🎬',
  appVersion: process.env.APP_VERSION || '1.0',
  apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3001',
  apiProductionUrl:
    process.env.API_PRODUCTION_URL || 'https://api.torungphim.com',
}));
