// 提取浏览器和设备信息
export function getBrowserDeviceInfo() {
  // 浏览器信息
  const browserInfo = {
    name: getBrowserName(),
    version: navigator.appVersion,
    language: navigator.language,
    userAgent: navigator.userAgent
  };

  // 设备信息
  const deviceInfo = {
    platform: navigator.platform,
    screen: `${screen.width}x${screen.height}`,
    pixelRatio: window.devicePixelRatio,
    isMobile: /Mobi|Android|iPhone/i.test(navigator.userAgent)
  };

  // 组合信息并生成简单标识
  const combined = JSON.stringify({ ...browserInfo, ...deviceInfo });
  const identifier = simpleHash(combined);

  return {
    browser: browserInfo,
    device: deviceInfo,
    identifier: identifier
  };
}

// 辅助函数：判断浏览器名称
function getBrowserName() {
  const userAgent = navigator.userAgent;

  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';

  return 'Unknown';
}

// 辅助函数：简单哈希算法生成标识
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  // 转换为16进制并取前8位
  return Math.abs(hash).toString(16).slice(0, 8);
}

