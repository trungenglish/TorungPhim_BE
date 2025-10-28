import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ResponseDto } from '../dto/response.dto';
import { map } from 'rxjs/operators';
import { Response } from 'express';

@Injectable()
export class TransformResponseInterceptor<T>
  implements NestInterceptor<T, ResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ResponseDto<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      map((data: T | null) => {
        return new ResponseDto<T>(
          data,
          'Thành công.',
          response.statusCode,
          request.url,
        );
      }),
    );
  }
}
