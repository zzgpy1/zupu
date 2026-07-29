import type { ApiResponse } from '../types';
import type { Context } from 'hono';

export class ResponseUtil {
  static success<T>(c: Context, data: T, message?: string): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message: message || '操作成功',
    };
    return c.json(response);
  }

  static error(c: Context, error: string, status: number = 400): Response {
    const response: ApiResponse = {
      success: false,
      error,
    };
    return c.json(response, status);
  }

  static paginated<T>(
    c: Context,
    data: T[],
    total: number,
    page: number,
    limit: number
  ): Response {
    const response: ApiResponse<T[]> = {
      success: true,
      data,
      pagination: {
        page,
        limit,
        total,
      },
    };
    return c.json(response);
  }

  static notFound(c: Context, resource: string = '资源'): Response {
    return this.error(c, `${resource}不存在`, 404);
  }
}
