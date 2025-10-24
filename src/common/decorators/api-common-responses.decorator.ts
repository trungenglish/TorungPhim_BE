// decorators/api-common-responses.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiCommonResponses() {
  return applyDecorators(
    ApiResponse({
      status: 401,
      description: 'Không được phép. Token không hợp lệ hoặc hết hạn.',
    }),
    ApiResponse({
      status: 403,
      description: 'Bị cấm. Không có quyền truy cập.',
    }),
    ApiResponse({ status: 404, description: 'Không tìm thấy tài nguyên.' }),
    ApiResponse({ status: 500, description: 'Lỗi máy chủ nội bộ.' }),
  );
}
