export const LAYOUT_ENUM = {
  a1: 'a1',
  a2: 'a2',
};

export const domainConfig = {
  localhost: {
    name: 'a1',
    baseUrl: 'https://c9-system.zeabur.app',
    layout: LAYOUT_ENUM.a1,
  },
  'c9-system.zeabur.app': {
    name: 'a1',
    baseUrl: 'https://c9-system.zeabur.app',
    layout: LAYOUT_ENUM.a1,
  },
};

export default function (hostName = 'localhost') {
  return domainConfig[hostName] || domainConfig.localhost;
}
