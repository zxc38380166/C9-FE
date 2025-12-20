export const LAYOUT_ENUM = {
  a1: 'a1',
  a2: 'a2',
};

export const domainConfig = {
  localhost: {
    name: 'a1',
    baseUrl: 'https://api.gofun.games',
    layout: LAYOUT_ENUM.a1,
  },
};

export default function (hostName = 'localhost') {
  return domainConfig[hostName] || domainConfig.localhost;
}
