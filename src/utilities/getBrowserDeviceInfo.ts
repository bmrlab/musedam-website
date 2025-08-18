
// 提取浏览器和设备信息
export function getBrowserDeviceInfo() {
  // 检查是否在客户端环境
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    // 服务器端环境，返回默认值
    return {
      browser: {
        name: 'Unknown',
        version: 'Unknown',
        language: 'Unknown',
        userAgent: 'Unknown'
      },
      device: {
        platform: 'Unknown',
        screen: 'Unknown',
        pixelRatio: 1,
        isMobile: false
      },
      identifier: 'server-side'
    };
  }

  // 检测是否在企业微信环境中
  const isWeChat = /MicroMessenger/i.test(navigator.userAgent);
  const isWeCom = /wxwork/i.test(navigator.userAgent);

  try {
    // 浏览器信息
    const browserInfo = {
      name: getBrowserName(),
      version: navigator.appVersion || 'Unknown',
      language: navigator.language || 'Unknown',
      userAgent: navigator.userAgent
    };

    // 设备信息 - 添加企业微信兼容性处理
    const deviceInfo = {
      platform: (navigator.platform || 'Unknown'),
      screen: (() => {
        try {
          if (typeof screen !== 'undefined' && screen && screen.width && screen.height) {
            return `${screen.width}x${screen.height}`;
          }
          return 'Unknown';
        } catch (e) {
          return 'Unknown';
        }
      })(),
      pixelRatio: (() => {
        try {
          if (typeof window !== 'undefined' && window.devicePixelRatio) {
            return window.devicePixelRatio;
          }
          return 1;
        } catch (e) {
          return 1;
        }
      })(),
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
  } catch (error) {
    // 如果出现任何错误，返回安全的默认值
    console.warn('Failed to get browser device info, using fallback:', error);
    return {
      browser: {
        name: isWeChat || isWeCom ? 'WeChat' : 'Unknown',
        version: 'Unknown',
        language: navigator.language || 'Unknown',
        userAgent: navigator.userAgent || 'Unknown'
      },
      device: {
        platform: 'Unknown',
        screen: 'Unknown',
        pixelRatio: 1,
        isMobile: /Mobi|Android|iPhone/i.test(navigator.userAgent || '')
      },
      identifier: 'fallback-' + Date.now()
    };
  }
}

// 辅助函数：判断浏览器名称
function getBrowserName() {
  // 检查是否在客户端环境
  if (typeof navigator === 'undefined' || typeof navigator.userAgent === 'undefined') {
    return 'Unknown';
  }

  const userAgent = navigator.userAgent;

  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera') || userAgent.includes('OPR')) return 'Opera';

  return 'Unknown';
}

// 辅助函数：简单哈希算法生成标识
function simpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为32位整数
  }
  // 转换为16进制并取前8位
  return Math.abs(hash).toString(16).slice(0, 8);
}

