import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(
    message: string = 'Resource not found',
    errorCode: string = 'NOT_FOUND',
  ) {
    super(
      {
        success: false,
        statusCode: HttpStatus.NOT_FOUND,
        errorCode,
        message,
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
