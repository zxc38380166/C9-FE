export default function () {
  return {
    login: (payload: any) => useHttp('/api/auth/login', { method: 'POST', body: payload }),
    register: (payload: any) => useHttp('/api/auth/register', { method: 'POST', body: payload }),
    getGameProvider: (payload: any, asyncOptions?: any) => useHttpAsync( `game-provider:${JSON.stringify(payload ?? {})}`, '/api/game/provider', { method: 'GET', params: payload }, asyncOptions ),
  };
}
