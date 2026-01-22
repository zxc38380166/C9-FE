import  { HTTP_METHOD } from './useHttp';

export default function () {
    return {
      login: (payload: any) => useHttp('/api/auth/login', { method: HTTP_METHOD.POST, body: payload }),
      register: (payload: any) => useHttp('/api/auth/register', { method: HTTP_METHOD.POST, body: payload }),
      getGameProvider: (payload: any, asyncOptions?: any) => useHttpAsync( `game-provider:${JSON.stringify(payload ?? {})}`, '/api/game/provider', { method: HTTP_METHOD.GET, params: payload }, asyncOptions ),
      getUserDetailSsr: (payload: any, asyncOptions?: any) => useHttpAsync( `user-detail:${JSON.stringify(payload ?? {})}`, '/api/auth/user-detail', { method: HTTP_METHOD.GET, params: payload }, asyncOptions ),
      getCountryCodesSsr: (payload: any, asyncOptions?: any) => useHttpAsync( `country-codes:${JSON.stringify(payload ?? {})}`, '/api/auth/country-codes', { method: HTTP_METHOD.GET, params: payload }, asyncOptions ),
      getUserDetailCsr: (payload: any) => useHttp('/api/auth/user-detail', { method: HTTP_METHOD.GET, body: payload }),
      getEnums: (payload: any, asyncOptions?: any) => useHttpAsync( `enums:${JSON.stringify(payload ?? {})}`, '/api/common/enums', { method: HTTP_METHOD.GET, params: payload }, asyncOptions ),
    };
  }