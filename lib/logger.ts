/**
 * Logger utility that conditionally logs to console based on environment.
 * In production, it suppresses logs unless explicitly enabled via environment variable.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';
type LogParams = unknown[];

const isProduction = process.env.NODE_ENV === 'production';
const isLoggingEnabled = process.env.NEXT_PUBLIC_ENABLE_LOGGING === 'true';

const logger = {
  /**
   * Debug level logging - completely suppressed in production
   */
  debug: (...args: LogParams): void => {
    if (!isProduction || isLoggingEnabled) {
      console.debug(...args);
    }
  },

  /**
   * Info level logging - suppressed in production unless enabled
   */
  info: (...args: LogParams): void => {
    if (!isProduction || isLoggingEnabled) {
      console.info(...args);
    }
  },

  /**
   * Warning level logging - always displayed
   */
  warn: (...args: LogParams): void => {
    console.warn(...args);
  },

  /**
   * Error level logging - always displayed
   */
  error: (...args: LogParams): void => {
    console.error(...args);
  },

  /**
   * Log with specific level
   */
  log: (level: LogLevel, ...args: LogParams): void => {
    switch (level) {
      case 'debug':
        logger.debug(...args);
        break;
      case 'info':
        logger.info(...args);
        break;
      case 'warn':
        logger.warn(...args);
        break;
      case 'error':
        logger.error(...args);
        break;
    }
  }
};

export default logger; 