export default function () {
    return {
      login: (payload: any) => useHttp('/api/auth/login', { method: 'POST', body: payload }),
      register: (payload: any) => useHttp('/api/auth/register', { method: 'POST', body: payload }),
      getGameProvider: (payload: any, asyncOptions?: any) => useHttpAsync( `game-provider:${JSON.stringify(payload ?? {})}`, '/api/game/provider', { method: 'GET', params: payload }, asyncOptions ),
      getUserDetail: (payload: any, asyncOptions?: any) => useHttpAsync( `user-detail:${JSON.stringify(payload ?? {})}`, '/api/auth/user-detail', { method: 'GET', params: payload }, asyncOptions ),
      getEnums: (payload: any, asyncOptions?: any) => useHttpAsync( `enums:${JSON.stringify(payload ?? {})}`, '/api/common/enums', { method: 'GET', params: payload }, asyncOptions ),
    };
  }