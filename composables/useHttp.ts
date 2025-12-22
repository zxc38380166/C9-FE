// ~/composables/useHttp.ts
import { defu } from 'defu';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpMiddlewareContext {
  url: string;
  options: RequestInit;
}

export interface HttpMiddlewares {
  /** 請求前（可改 options） */
  before?: (ctx: HttpMiddlewareContext) => void | Promise<void>;
  /** 回傳後（可改 response data） */
  after?: (data: any, ctx: HttpMiddlewareContext) => any;
  /** 錯誤處理 */
  onError?: (error: any, ctx: HttpMiddlewareContext) => any;
}

export interface UseHttpOptions<T = any> {
  method?: HttpMethod;
  /** query string */
  params?: Record<string, any>;
  /** request body */
  body?: any;
  headers?: HeadersInit;
  middlewares?: HttpMiddlewares;
  /** 是否自動 stringify body */
  json?: boolean;
  /** fetch 原生 options 補充 */
  fetchOptions?: RequestInit;
}

/* ----------------------------- utils ----------------------------- */

function buildQuery(params?: Record<string, any>) {
  if (!params) return '';
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    search.append(k, String(v));
  });
  const q = search.toString();
  return q ? `?${q}` : '';
}

/* ----------------------------- main ----------------------------- */

export async function useHttp<T = any>(url: string, options: UseHttpOptions<T> = {}): Promise<T> {
  const { method = 'GET', params, body, headers, middlewares, json = true, fetchOptions } = options;

  const fullUrl = url + buildQuery(params);

  const requestOptions: RequestInit = defu(
    {
      method,
      headers: {
        ...(json ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body && method !== 'GET' ? (json ? JSON.stringify(body) : body) : undefined,
    },
    fetchOptions,
  );

  const ctx: HttpMiddlewareContext = {
    url: fullUrl,
    options: requestOptions,
  };

  try {
    /* ---------- before middleware ---------- */
    if (middlewares?.before) {
      await middlewares.before(ctx);
    }

    const res = await fetch(ctx.url, ctx.options);

    if (!res.ok) {
      throw res;
    }

    const data = await res.json();

    /* ---------- after middleware ---------- */
    if (middlewares?.after) {
      return middlewares.after(data, ctx);
    }

    return data as T;
  } catch (error) {
    /* ---------- error middleware ---------- */
    if (middlewares?.onError) {
      return middlewares.onError(error, ctx);
    }
    throw error;
  }
}
