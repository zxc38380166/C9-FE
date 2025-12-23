import { computed } from 'vue';
import { useMediaQuery, useWindowSize } from '@vueuse/core';
import { useRequestHeaders } from '#app';

type Brand =
  | 'apple'
  | 'samsung'
  | 'google'
  | 'huawei'
  | 'xiaomi'
  | 'oppo'
  | 'vivo'
  | 'oneplus'
  | 'sony'
  | 'lg'
  | 'motorola'
  | 'unknown';

type Browser = 'safari' | 'chrome' | 'edge' | 'firefox' | 'opera' | 'unknown';
type OS = 'ios' | 'android' | 'macos' | 'windows' | 'linux' | 'unknown';

function safeUA(ua?: string) {
  return (ua || '').toLowerCase();
}

function detectOS(ua: string): OS {
  if (/iphone|ipad|ipod/.test(ua)) return 'ios';
  if (/android/.test(ua)) return 'android';
  if (/macintosh|mac os x/.test(ua)) return 'macos';
  if (/windows nt/.test(ua)) return 'windows';
  if (/linux/.test(ua)) return 'linux';
  return 'unknown';
}

function detectBrowser(ua: string): Browser {
  if (/edg\//.test(ua)) return 'edge';
  if (/opr\//.test(ua) || /opera/.test(ua)) return 'opera';
  if (/firefox\//.test(ua)) return 'firefox';

  const isSafari =
    /safari\//.test(ua) && !/chrome\//.test(ua) && !/crios\//.test(ua) && !/edg\//.test(ua);
  if (isSafari) return 'safari';

  if (/chrome\//.test(ua) || /crios\//.test(ua)) return 'chrome';
  return 'unknown';
}

function detectBrand(ua: string): Brand {
  if (/iphone|ipad|ipod|macintosh/.test(ua)) return 'apple';
  if (/samsung|sm-/.test(ua)) return 'samsung';
  if (/pixel/.test(ua)) return 'google';
  if (/huawei|honor/.test(ua)) return 'huawei';
  if (/xiaomi|redmi|mi\s|poco/.test(ua)) return 'xiaomi';
  if (/oppo/.test(ua)) return 'oppo';
  if (/vivo/.test(ua)) return 'vivo';
  if (/oneplus/.test(ua)) return 'oneplus';
  if (/sony/.test(ua)) return 'sony';
  if (/lg-/.test(ua) || /\blg\b/.test(ua)) return 'lg';
  if (/moto|motorola/.test(ua)) return 'motorola';
  return 'unknown';
}

export default function (options?: { desktopMinWidth?: number }) {
  const desktopMinWidth = options?.desktopMinWidth ?? 768;

  // ✅ UA：SSR 用 headers，CSR 用 navigator.userAgent
  const ua = computed(() => {
    if (import.meta.server) {
      const h = useRequestHeaders(['user-agent']);
      return safeUA(h['user-agent']);
    }
    return safeUA(navigator.userAgent);
  });

  // 尺寸
  const { width } = useWindowSize();
  const isDesktopWidth = computed(() => (width.value || 0) >= desktopMinWidth);

  // 觸控/hover
  const isCoarsePointer = useMediaQuery('(pointer: coarse)');
  const isHoverNone = useMediaQuery('(hover: none)');
  const isTouchDevice = computed(() => isCoarsePointer.value || isHoverNone.value);

  // 橫/直屏（用 media query 最穩）
  const isLandscape = useMediaQuery('(orientation: landscape)');
  const isPortrait = useMediaQuery('(orientation: portrait)');

  // OS/Browser/Brand
  const os = computed<OS>(() => detectOS(ua.value));
  const browser = computed<Browser>(() => detectBrowser(ua.value));
  const brand = computed<Brand>(() => detectBrand(ua.value));

  const isIOS = computed(() => os.value === 'ios');
  const isAndroid = computed(() => os.value === 'android');
  const isMac = computed(() => os.value === 'macos');
  const isWindows = computed(() => os.value === 'windows');
  const isLinux = computed(() => os.value === 'linux');

  // iPadOS：UA 常像 macOS，但有觸控 + Mobile
  const isIPadLike = computed(() => {
    const u = ua.value;
    const uaSaysIpad = /ipad/.test(u);
    const macTouch = os.value === 'macos' && isTouchDevice.value && /mobile/.test(u);
    return uaSaysIpad || macTouch;
  });

  const isTabletUA = computed(() => /ipad|tablet/.test(ua.value) || isIPadLike.value);
  const isMobileUA = computed(() => /mobi|iphone|ipod|android/.test(ua.value) && !isIPadLike.value);

  const isTablet = computed(() => isTabletUA.value);
  const isMobile = computed(() => {
    // 手機：UA 或 觸控+非桌機寬度+非平板
    return isMobileUA.value || (isTouchDevice.value && !isDesktopWidth.value && !isTablet.value);
  });
  const isDesktop = computed(() => isDesktopWidth.value && !isMobile.value && !isTablet.value);

  // Browser flags
  const isSafari = computed(() => browser.value === 'safari');
  const isChrome = computed(() => browser.value === 'chrome');
  const isEdge = computed(() => browser.value === 'edge');
  const isFirefox = computed(() => browser.value === 'firefox');

  // 常見機型/品牌
  const isIPhone = computed(() => /iphone/.test(ua.value));
  const isIPad = computed(() => isIPadLike.value);
  const isSamsung = computed(() => brand.value === 'samsung');
  const isPixel = computed(() => brand.value === 'google');
  const isHuawei = computed(() => brand.value === 'huawei');
  const isXiaomi = computed(() => brand.value === 'xiaomi');
  const isOppo = computed(() => brand.value === 'oppo');
  const isVivo = computed(() => brand.value === 'vivo');

  return {
    ua,
    width,

    // type
    isMobile,
    isTablet,
    isDesktop,
    isTouchDevice,

    // orientation
    isLandscape,
    isPortrait,

    // OS
    os,
    isIOS,
    isAndroid,
    isMac,
    isWindows,
    isLinux,

    // browser
    browser,
    isSafari,
    isChrome,
    isEdge,
    isFirefox,

    // brand/model-ish
    brand,
    isIPhone,
    isIPad,
    isSamsung,
    isPixel,
    isHuawei,
    isXiaomi,
    isOppo,
    isVivo,
  };
}
