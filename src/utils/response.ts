import type { Context } from 'hono';
import type { ContentfulStatusCode } from 'hono/utils/http-status';  // ← 导入状态码类型
import type { ApiResponse } from '../types';

export class ResponseUtil {
  static success<T>(c: Context, data: T, message?: string): Response {
    const response: ApiResponse<T> = {
      success: true,
      data,
      message: message || '操作成功',
    };
    return c.json(response, 200); // 200 是 ContentfulStatusCode
  }

  static error(c: Context, error: string, status: ContentfulStatusCode = 400): Response {
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
