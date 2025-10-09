import { HttpException, HttpStatus } from '@nestjs/common';

export class InternalServerErrorException extends HttpException {
  constructor(
    message: string = 'Internal server error',
    errorCode: string = 'INTERNAL_SERVER_ERROR',
  ) {
    super(
      {
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorCode,
        message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
