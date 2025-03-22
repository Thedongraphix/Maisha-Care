/**
 * Configurable logger utility for Maisha Care application
 * 
 * This utility allows you to control logging levels across the application
 * from a single location. It provides methods for different log levels
 * and respects the current environment (development vs production).
 */

// Set to false to disable detailed logging in development
const DEV_LOGGING_ENABLED = false;

// In production, we generally want minimal logging
const isProduction = process.env.NODE_ENV === 'production';

/**
 * Log levels
 */
export enum LogLevel {
  DEBUG = 0,  // Detailed debug information
  INFO = 1,   // Interesting events
  WARN = 2,   // Potentially problematic situations
  ERROR = 3,  // Error events that might still allow the application to continue
  NONE = 4    // No logging
}

// Current log level - change this to control verbosity
const currentLogLevel = isProduction ? LogLevel.ERROR : (DEV_LOGGING_ENABLED ? LogLevel.DEBUG : LogLevel.WARN);

/**
 * Debug level logging - for detailed information
 */
export function debug(message: string, ...data: any[]): void {
  if (currentLogLevel <= LogLevel.DEBUG) {
    console.log(`[DEBUG] ${message}`, ...data);
  }
}

/**
 * Info level logging - for normal but significant events
 */
export function info(message: string, ...data: any[]): void {
  if (currentLogLevel <= LogLevel.INFO) {
    console.log(`[INFO] ${message}`, ...data);
  }
}

/**
 * Warning level logging - for concerning situations
 */
export function warn(message: string, ...data: any[]): void {
  if (currentLogLevel <= LogLevel.WARN) {
    console.warn(`[WARN] ${message}`, ...data);
  }
}

/**
 * Error level logging - for error events
 */
export function error(message: string, ...data: any[]): void {
  if (currentLogLevel <= LogLevel.ERROR) {
    console.error(`[ERROR] ${message}`, ...data);
  }
}

/**
 * Group logs together
 */
export function group(name: string, fn: () => void): void {
  if (currentLogLevel < LogLevel.NONE) {
    console.group(name);
    fn();
    console.groupEnd();
  }
}

export default {
  debug,
  info,
  warn,
  error,
  group,
  LogLevel
}; 