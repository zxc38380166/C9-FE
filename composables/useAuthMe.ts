export async function fetchMe() {
  return await useHttp<{
    code: number;
    data: {
      user: {
        id: number;
        account: string;
        name?: string;
      };
    };
  }>('http://localhost:8080/api/auth/me', {
    method: 'GET',
    headers: {
      'X-App': 'C9',
    },
    middlewares: {
      before({ options }) {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }

        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      },

      after(response) {
        if (response.code !== 0) {
          throw response;
        }

        return response.data.user;
      },

      onError(error) {
        console.error('[auth/me] error', error);
        throw error;
      },
    },
  });
}
