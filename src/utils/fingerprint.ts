import FingerprintJS from '@fingerprintjs/fingerprintjs'

/** 缓存 key */
const FINGERPRINT_CACHE_KEY = 'device_fingerprint'
/** 缓存有效期（24小时） */
const CACHE_EXPIRY = 24 * 60 * 60 * 1000

/** 缓存数据结构 */
interface FingerprintCache {
  fingerprint: string
  timestamp: number
}

/**
 * 获取缓存的设备指纹
 */
export function getCachedFingerprint(): string | null {
  try {
    const cached = localStorage.getItem(FINGERPRINT_CACHE_KEY)
    if (!cached) return null

    const data: FingerprintCache = JSON.parse(cached)
    const now = Date.now()

    // 检查是否过期
    if (now - data.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(FINGERPRINT_CACHE_KEY)
      return null
    }

    return data.fingerprint
  } catch (error) {
    console.error('❌ 读取缓存的设备指纹失败:', error)
    return null
  }
}

/**
 * 缓存设备指纹
 * @param fingerprint 设备指纹
 */
function cacheFingerprint(fingerprint: string): void {
  try {
    const data: FingerprintCache = {
      fingerprint,
      timestamp: Date.now()
    }
    localStorage.setItem(FINGERPRINT_CACHE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error('❌ 缓存设备指纹失败:', error)
  }
}

/**
 * 清除设备指纹缓存
 */
export function clearFingerprintCache(): void {
  try {
    localStorage.removeItem(FINGERPRINT_CACHE_KEY)
    console.log('✅ 设备指纹缓存已清除')
  } catch (error) {
    console.error('❌ 清除设备指纹缓存失败:', error)
  }
}

/**
 * 收集设备信息
 */
function collectDeviceInfo(): Record<string, any> {
  const startTime = performance.now()

  const info = {
    // 平台信息
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    language: navigator.language,
    languages: navigator.languages,

    // 屏幕信息
    screenWidth: screen.width,
    screenHeight: screen.height,
    screenColorDepth: screen.colorDepth,
    screenPixelDepth: screen.pixelDepth,
    devicePixelRatio: window.devicePixelRatio,

    // 时区信息
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timezoneOffset: new Date().getTimezoneOffset(),

    // 硬件信息
    hardwareConcurrency: navigator.hardwareConcurrency,
    deviceMemory: (navigator as any).deviceMemory,

    // 浏览器信息
    cookieEnabled: navigator.cookieEnabled,
    doNotTrack: navigator.doNotTrack,
    maxTouchPoints: navigator.maxTouchPoints
  }

  const endTime = performance.now()
  console.log(`📊 收集设备信息耗时: ${(endTime - startTime).toFixed(2)}ms`)

  return info
}

/**
 * 检测浏览器特征
 */
function detectBrowserFeatures(): Record<string, boolean> {
  const startTime = performance.now()

  const features = {
    // 存储特征
    localStorage: !!window.localStorage,
    sessionStorage: !!window.sessionStorage,
    indexedDB: !!window.indexedDB,

    // 图形特征
    canvas: !!document.createElement('canvas').getContext,
    webgl: !!document.createElement('canvas').getContext('webgl'),
    webgl2: !!document.createElement('canvas').getContext('webgl2'),

    // 音频特征
    audioContext: !!(window.AudioContext || (window as any).webkitAudioContext),

    // 其他特征
    webWorker: !!window.Worker,
    serviceWorker: 'serviceWorker' in navigator,
    webRTC: !!(window.RTCPeerConnection || (window as any).webkitRTCPeerConnection),
    webSocket: !!window.WebSocket,
    geolocation: !!navigator.geolocation,
    notification: 'Notification' in window,
    vibrate: !!navigator.vibrate,
    battery: 'getBattery' in navigator,
    bluetooth: 'bluetooth' in navigator,
    usb: 'usb' in navigator
  }

  const endTime = performance.now()
  console.log(`🔍 特征检测耗时: ${(endTime - startTime).toFixed(2)}ms`)

  return features
}

/**
 * 使用 SHA-256 生成哈希
 * @param data 数据
 */
async function sha256(data: string): Promise<string> {
  const startTime = performance.now()

  try {
    const encoder = new TextEncoder()
    const dataBuffer = encoder.encode(data)
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    const endTime = performance.now()
    console.log(`🔨 SHA-256计算耗时: ${(endTime - startTime).toFixed(2)}ms`)

    return hashHex
  } catch (error) {
    console.error('❌ SHA-256 计算失败:', error)
    // 降级方案：使用简单的字符串哈希
    let hash = 0
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16)
  }
}

/**
 * 获取增强的设备指纹
 */
export async function getEnhancedFingerprint(): Promise<string> {
  const totalStartTime = performance.now()
  console.log('🔍 开始生成设备指纹...')

  try {
    // 1. 检查缓存
    const cached = getCachedFingerprint()
    if (cached) {
      const totalEndTime = performance.now()
      console.log(`🔍 使用缓存的设备指纹，总耗时: ${(totalEndTime - totalStartTime).toFixed(2)}ms`)
      console.log(`🔑 设备指纹: ${cached}`)
      return cached
    }

    // 2. 收集设备信息
    const deviceInfo = collectDeviceInfo()

    // 3. 使用 FingerprintJS 获取基础浏览器指纹
    const fpStartTime = performance.now()
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    const baseFp = result.visitorId
    const fpEndTime = performance.now()
    console.log(`🔑 基础指纹生成耗时: ${(fpEndTime - fpStartTime).toFixed(2)}ms`)

    // 4. 检测浏览器特征
    const features = detectBrowserFeatures()

    // 5. 组合所有特征
    const combinedData = {
      baseFp,
      deviceInfo,
      features,
      components: result.components
    }

    // 6. 生成最终指纹（使用 SHA-256）
    const dataString = JSON.stringify(combinedData)
    const fingerprint = await sha256(dataString)

    // 7. 缓存结果
    cacheFingerprint(fingerprint)

    const totalEndTime = performance.now()
    console.log(`🔍 设备指纹获取总耗时: ${(totalEndTime - totalStartTime).toFixed(2)}ms`)
    console.log(`🔑 设备指纹: ${fingerprint}`)

    return fingerprint
  } catch (error) {
    console.error('❌ 设备指纹生成失败:', error)

    // 降级方案：使用时间戳 + 随机数
    const fallbackFp = `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
    console.warn(`⚠️ 使用降级方案生成设备指纹: ${fallbackFp}`)

    return fallbackFp
  }
}

/**
 * 初始化设备指纹（预加载）
 * 可以在应用启动时调用，提前生成指纹
 */
export async function initFingerprint(): Promise<void> {
  try {
    const fingerprint = await getEnhancedFingerprint()
    console.log('✅ 设备指纹初始化成功:', fingerprint)
  } catch (error) {
    console.error('❌ 设备指纹初始化失败:', error)
  }
}

