import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  constructor(
    message: string = 'Bad request',
    errorCode: string = 'BAD_REQUEST',
  ) {
    super(
      {
        success: false,
        statusCode: HttpStatus.BAD_REQUEST,
        errorCode,
        message,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
