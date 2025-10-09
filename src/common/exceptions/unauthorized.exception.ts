import { HttpException, HttpStatus } from '@nestjs/common';

export class UnauthorizedException extends HttpException {
  constructor(
    message: string = 'Unauthorized',
    errorCode: string = 'UNAUTHORIZED',
  ) {
    super(
      {
        success: false,
        statusCode: HttpStatus.UNAUTHORIZED,
        errorCode,
        message,
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
