import { defu } from 'defu';
import config from './useConfig';
import type { AsyncDataOptions } from '#app';
import { getRequestHost } from 'h3';
import { useRequestEvent } from '#app';

export type HttpMethod = (typeof HTTP_METHOD)[keyof typeof HTTP_METHOD];

export const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
} as const;

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
  auth?: boolean;
  tokenCookieKey?: string;
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

/** 把 HeadersInit 統一轉成 Record<string,string>，避免 defu 型別亂掉 */
function normalizeHeaders(h?: HeadersInit): Record<string, string> {
  const out: Record<string, string> = {};
  if (!h) return out;

  if (h instanceof Headers) {
    h.forEach((v, k) => {
      out[k] = v;
    });
    return out;
  }

  if (Array.isArray(h)) {
    for (const [k, v] of h) out[k] = v;
    return out;
  }

  // Record<string, string>
  for (const [k, v] of Object.entries(h)) {
    if (v === undefined || v === null) continue;
    out[k] = String(v);
  }
  return out;
}

/** SSR-safe：cookie 優先，client 才 fallback localStorage */
function getTokenSSRSafe(cookieKey = 'token'): string | null {
  const tokenCookie = useCookie<string | null>(cookieKey, { path: '/' });
  if (tokenCookie.value) return tokenCookie.value;
  return null;
}

/** SSR 時把 cookie/authorization forward 給後端（可選） */
function getForwardHeadersObj(): Record<string, string> {
  if (!import.meta.server) return {};
  const h = useRequestHeaders(['cookie', 'authorization']);
  const out: Record<string, string> = {};
  if (h.cookie) out.cookie = h.cookie;
  if (h.authorization) out.authorization = h.authorization;
  return out;
}

function getHostnameSsrSafe(): string {
  if (import.meta.client) return window.location.hostname;

  const event = useRequestEvent();
  if (!event) return '';

  const hostRaw = getRequestHost(event, { xForwardedHost: true }) ?? '';
  const host = hostRaw.split(',')[0]?.trim()?.split(':')[0] ?? '';

  return host;
}

/* ----------------------------- main (promise) ----------------------------- */

export async function useHttp<T = any>(url: string, options: UseHttpOptions<T> = {}): Promise<T> {
  const {
    method = 'GET',
    params,
    body,
    headers,
    middlewares,
    json = true,
    fetchOptions,
    auth = true,
    tokenCookieKey = 'token',
  } = options;

  const hostname = getHostnameSsrSafe();
  const baseUrl = config(hostname).baseUrl || 'http://localhost:8080';

  const fullUrl = baseUrl + url + buildQuery(params);

  // ✅ headers 一律用「純 object」合併（不要 defu）
  const baseHeaders: Record<string, string> = {
    'X-App': 'C9',
    ...(json ? { 'Content-Type': 'application/json' } : {}),
    ...getForwardHeadersObj(),
    ...normalizeHeaders(headers),
    ...normalizeHeaders(fetchOptions?.headers), // fetchOptions 的 headers 也允許覆蓋
  };

  if (auth) {
    const token = getTokenSSRSafe(tokenCookieKey);
    console.log(token, '打api時拿的');
    if (token) baseHeaders.Authorization = `Bearer ${token}`;
  }

  // ✅ defu 只合併非 headers 欄位，避免型別污染
  const requestOptions: RequestInit = defu(
    {
      method,
      headers: baseHeaders,
      body: body && method !== 'GET' ? (json ? JSON.stringify(body) : body) : undefined,
    },
    {
      ...fetchOptions,
      headers: undefined, // 已經手動合併過 headers，避免 defu 再碰一次
    },
  );

  const ctx: HttpMiddlewareContext = { url: fullUrl, options: requestOptions };

  try {
    if (middlewares?.before) await middlewares.before(ctx);

    const res = await fetch(ctx.url, ctx.options);

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      const err = new Error(`HTTP ${res.status} ${res.statusText} - ${ctx.url}`);
      (err as any).status = res.status;
      (err as any).statusText = res.statusText;
      (err as any).body = text;
      throw err;
    }

    const data = await res.json();

    if (middlewares?.after) return middlewares.after(data, ctx);
    return data as T;
  } catch (error) {
    if (middlewares?.onError) return middlewares.onError(error, ctx);
    throw error;
  }
}

/* ----------------------------- SSR prefetch (useAsyncData) ----------------------------- */

export function useHttpAsync<T = any>(
  key: string,
  url: string,
  options: UseHttpOptions<T> = {},
  asyncOptions: AsyncDataOptions<T> = {},
) {
  return useAsyncData<T>(
    key,
    () => useHttp<T>(url, options),
    defu({ server: true, lazy: false }, asyncOptions),
  );
}
