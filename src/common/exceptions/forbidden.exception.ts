import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(
    message: string = 'Access is denied',
    errorCode: string = 'FORBIDDEN',
  ) {
    super(
      {
        success: false,
        statusCode: HttpStatus.FORBIDDEN,
        errorCode,
        message,
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
