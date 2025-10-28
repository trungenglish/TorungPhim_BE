export class ResponseDto<T> {
  success: boolean;
  message?: string;
  data?: T | null;
  statusCode: number;
  path?: string;
  timestamp: string;

  constructor(
    data?: T | null,
    message = 'Thành công.',
    statusCode = 200,
    path?: string,
  ) {
    this.success = true;
    this.message = message;
    this.data = data ?? null;
    this.statusCode = statusCode;
    this.path = path;
    this.timestamp = new Date().toISOString();
  }
}
