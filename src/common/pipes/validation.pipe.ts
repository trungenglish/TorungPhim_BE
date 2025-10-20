import { ValidationPipe as NestValidationPipe } from '@nestjs/common';

export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true, // Loại bỏ properties không có decorator
      forbidNonWhitelisted: true, // Throw error nếu có property không hợp lệ
      transform: true, // Tự động transform types (string -> number)
      transformOptions: {
        enableImplicitConversion: true, // Cho phép conversion ngầm định
      },
      disableErrorMessages: process.env.NODE_ENV === 'production', // Ẩn error detail ở production
    });
  }
}
