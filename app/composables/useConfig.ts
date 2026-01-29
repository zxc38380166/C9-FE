export const LAYOUT_ENUM = {
  a1: 'a1',
};

export const domainConfig: any = {
  localhost: {
    baseUrl: 'http://localhost:8080',
    socketUrl: 'http://localhost:8080',
    imgUrl: 'https://pub-fbbcd2298f7c4e6aa4d5f9cc90ff6d88.r2.dev',
    layout: LAYOUT_ENUM.a1,
    siteName: 'C9科技',
  },
  ['c9-ec.zeabur.app']: {
    baseUrl: 'https://c9-api.zeabur.app',
    socketUrl: 'http://localhost:8080',
    imgUrl: 'https://pub-fbbcd2298f7c4e6aa4d5f9cc90ff6d88.r2.dev',
    layout: LAYOUT_ENUM.a1,
    siteName: 'C9科技',
  },
};

export default function (customHostName: any = '') {
  const ssrHost = new URL(`http://${useRequestHeaders().host}`)?.hostname;
  const csrHost = window?.location?.hostname;
  const defaultHostName = process.server ? ssrHost : csrHost;
  const localHostName = 'localhost';
  const hostName = customHostName || defaultHostName || localHostName;

  return domainConfig?.[hostName] || domainConfig.localhost;
}
