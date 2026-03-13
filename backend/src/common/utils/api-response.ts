export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
}

export function successResponse<T>(message: string, data: T, meta?: ApiMeta) {
  return {
    success: true,
    message,
    data,
    ...(meta ? { meta } : {}),
  };
}

export function errorResponse(message: string, details?: unknown) {
  return {
    success: false,
    message,
    ...(details ? { details } : {}),
  };
}
