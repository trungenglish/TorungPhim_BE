import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();
    const requestId = uuidv4();

    req['requestId'] = requestId;

    this.logger.info(
      `${req.method} ${req.originalUrl} - ${req.ip} - User-Agent: ${req.get('User-Agent')}`,
      { context: 'HTTP Request', requestId },
    );

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      const logLevel = statusCode >= 400 ? 'error' : 'info';

      this.logger[logLevel](
        `${req.method} ${req.originalUrl} - ${statusCode} - ${duration}ms`,
        { context: 'HTTP Response', requestId, statusCode, duration },
      );
    });

    next();
  }
}
