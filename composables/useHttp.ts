import { defu } from 'defu';
import config from '../site.config';
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpMiddlewareContext {
  url: string;
  options: RequestInit;
}

export interface HttpMiddlewares {
  before?: (ctx: HttpMiddlewareContext) => void | Promise<void>;
  after?: (data: any, ctx: HttpMiddlewareContext) => any;
  onError?: (error: any, ctx: HttpMiddlewareContext) => any;
}

export interface UseHttpOptions<T = any> {
  method?: HttpMethod;
  params?: Record<string, any>;
  body?: any;
  headers?: HeadersInit;
  middlewares?: HttpMiddlewares;
  json?: boolean;
  fetchOptions?: RequestInit;

  /** 🔐 是否自動帶 token（預設 true） */
  auth?: boolean;
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

function getToken(): string | null {
  // SSR-safe
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

/* ----------------------------- main ----------------------------- */

export async function useHttp<T = any>(url: string, options: UseHttpOptions<T> = {}): Promise<T> {
  const {
    method = 'GET',
    params,
    body,
    headers,
    middlewares,
    json = true,
    fetchOptions,
    auth = true, // 👈 預設開啟
  } = options;

  const req = useRequestURL();
  const hostname = import.meta.client ? window.location.hostname : req.hostname;
  const baseUrl = config(hostname).baseUrl || 'http://localhost:8080';
  const fullUrl = baseUrl + url + buildQuery(params);

  /* ---------- default headers ---------- */
  const defaultHeaders: HeadersInit = {
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
    'X-App': 'C9',
  };

  /* ---------- auto attach token ---------- */
  if (auth) {
    const token = getToken();
    if (token) {
      (defaultHeaders as Record<string, string>).Authorization = `Bearer ${token}`;
    }
  }

  const requestOptions: RequestInit = defu(
    {
      method,
      headers: defaultHeaders,
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
