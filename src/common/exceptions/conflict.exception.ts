import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  constructor(
    message: string = 'Conflict detected',
    errorCode: string = 'CONFLICT',
  ) {
    super(
      {
        success: false,
        statusCode: HttpStatus.CONFLICT,
        errorCode,
        message,
      },
      HttpStatus.CONFLICT,
    );
  }
}
