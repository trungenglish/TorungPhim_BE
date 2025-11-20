import { APP_GUARD } from '@nestjs/core';
import { Type } from '@nestjs/common';

/**
 * Helper function để tạo APP_GUARD providers cho NestJS modules
 * @param guards - Danh sách guard classes cần đăng ký
 * @returns Mảng providers cho APP_GUARD
 */
export const createAppGuards = (...guards: Type<any>[]) =>
  guards.map((guard) => ({
    provide: APP_GUARD,
    useClass: guard,
  }));
