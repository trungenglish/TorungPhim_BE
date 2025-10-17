import { registerAs } from '@nestjs/config';

export const envConfig = registerAs('env', () => ({
  envFilePath: '.env',
  isGlobal: true,
  // cache: true,
  // expandVariables: true,
  // validationSchema: null,
}));
