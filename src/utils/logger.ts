export function logInfo(...args: any[]): void {
  console.log('[INFO]', ...args);
}

export function logWarn(...args: any[]): void {
  console.warn('[WARN]', ...args);
}

export function logError(...args: any[]): void {
  console.error('[ERROR]', ...args);
}

export function logDebug(...args: any[]): void {
  console.debug('[DEBUG]', ...args);
}