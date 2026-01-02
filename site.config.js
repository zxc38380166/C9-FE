export const LAYOUT_ENUM = {
  a1: 'a1',
  a2: 'a2',
};

export const domainConfig = {
  localhost: {
    template: 'a1',
    site: 'C9-a1',
    baseUrl: 'http://localhost:8080',
    layout: LAYOUT_ENUM.a1,
    imgUrl: 'https://pub-8ad0488587374373b2fd30c725fac6bc.r2.dev',
  },
  'c9-casino.zeabur.app': {
    template: 'a1',
    site: 'C9-a1',
    baseUrl: 'https://c9-system.zeabur.app',
    layout: LAYOUT_ENUM.a1,
    imgUrl: 'https://pub-8ad0488587374373b2fd30c725fac6bc.r2.dev',
  },
};

export default function (hostName = 'localhost') {
  return domainConfig[hostName] || domainConfig.localhost;
}
