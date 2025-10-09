import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let resBody = {
      success: false,
      message: 'Internal server error',
      errorCode: 'INTERNAL_ERROR',
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exRes = exception.getResponse();

      if (typeof exRes === 'object') {
        resBody = {
          ...resBody,
          ...exRes,
          timestamp: new Date().toISOString(),
          path: request.url,
        };
      } else {
        resBody = {
          ...resBody,
          message: exRes,
        };
      }
    }

    response.status(status).json(resBody);
  }
}
