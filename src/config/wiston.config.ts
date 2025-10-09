import { ConfigModule, ConfigService } from '@nestjs/config';
import * as winston from 'winston';
import * as path from 'path';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';

export const winstonConfig = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    level: configService.get<string>('LOG_LEVEL', 'info'),
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('TorungPhim', {
        colors: true,
        prettyPrint: true,
      }),
    ),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'app.log'),
      }),
      new winston.transports.File({
        filename: path.join(process.cwd(), 'logs', 'error.log'),
        level: 'error',
      }),
    ],
  }),
  inject: [ConfigService],
};
