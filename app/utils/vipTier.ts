export interface VipTierStyle {
  bg: string;
  badge: string;
  bar: string;
  text: string;
  badgeColor: string;
  icon: string;
  ring: string;
}

export const VIP_TIER_STYLES: Record<string, VipTierStyle> = {
  bronze: {
    bg: 'bg-linear-to-br from-[#2a1f14] to-[#131f30]',
    badge: 'bg-linear-to-br from-amber-700/30 to-amber-900/20 ring-1 ring-amber-600/30',
    bar: 'bg-linear-to-r from-amber-700 to-amber-500',
    text: 'text-amber-500',
    badgeColor: 'warning',
    icon: 'noto:3rd-place-medal',
    ring: 'ring-amber-600/40',
  },
  gold: {
    bg: 'bg-linear-to-br from-[#2a2414] to-[#131f30]',
    badge: 'bg-linear-to-br from-amber-500/30 to-amber-700/20 ring-1 ring-amber-400/30',
    bar: 'bg-linear-to-r from-amber-500 to-amber-300',
    text: 'text-amber-400',
    badgeColor: 'warning',
    icon: 'noto:1st-place-medal',
    ring: 'ring-amber-400/40',
  },
  platinum: {
    bg: 'bg-linear-to-br from-[#1a1f2e] to-[#131f30]',
    badge: 'bg-linear-to-br from-blue-500/30 to-blue-700/20 ring-1 ring-blue-400/30',
    bar: 'bg-linear-to-r from-blue-500 to-blue-300',
    text: 'text-blue-400',
    badgeColor: 'info',
    icon: 'noto:gem-stone',
    ring: 'ring-blue-400/40',
  },
  diamond: {
    bg: 'bg-linear-to-br from-[#1f142a] to-[#131f30]',
    badge: 'bg-linear-to-br from-purple-500/30 to-purple-700/20 ring-1 ring-purple-400/30',
    bar: 'bg-linear-to-r from-purple-500 to-purple-300',
    text: 'text-purple-400',
    badgeColor: 'error',
    icon: 'noto:crown',
    ring: 'ring-purple-400/40',
  },
};

/** Get tier style with bronze fallback */
export const getVipTierStyle = (tier: string): VipTierStyle =>
  VIP_TIER_STYLES[tier] ?? VIP_TIER_STYLES.bronze!;

export const VIP_TIER_LABELS: Record<string, string> = {
  bronze: '青銅',
  gold: '黃金',
  platinum: '鉑金',
  diamond: '鑽石',
};

export const getVipTierLabel = (tier: string): string =>
  VIP_TIER_LABELS[tier] || tier || '';
