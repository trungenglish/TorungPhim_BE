import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { Prisma } from '@prisma/client';

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

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Dịch các lỗi đã biết của Prisma sang mã HTTP
      switch (exception.code) {
        case 'P2002': // Lỗi trùng lặp (Unique constraint failed)
          status = HttpStatus.CONFLICT; // 409
          resBody.message = 'Dữ liệu này đã tồn tại (trùng lặp).';
          resBody.errorCode = 'CONFLICT';
          break;
        case 'P2025': // Lỗi không tìm thấy (Record not found)
          status = HttpStatus.NOT_FOUND; // 404
          resBody.message = 'Không tìm thấy tài nguyên được yêu cầu.';
          resBody.errorCode = 'NOT_FOUND';
          break;
        default:
          // Các lỗi Prisma khác mà bạn chưa xử lý
          resBody.message = `Lỗi cơ sở dữ liệu (Prisma code: ${exception.code})`;
          break;
      }
    } else if (exception instanceof HttpException) {
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
