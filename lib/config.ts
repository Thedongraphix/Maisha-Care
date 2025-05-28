export const config = {
  // Backend API Configuration
  AI_BACKEND_URL: process.env.AI_BACKEND_URL || 'https://v2deployment-production.up.railway.app',
  
  // Client-side proxy routes (for browser requests)
  API_PROXY_BASE: '/api/proxy',
  
  // Timeout configurations (in milliseconds)
  timeouts: {
    CHAT_REQUEST: 240000,        // 4 minutes
    FILE_UPLOAD: 180000,         // 3 minutes
    SSE_IDLE: 60000,             // 1 minute
    HEALTH_CHECK: 10000,         // 10 seconds
    CONNECTION_RETRY: 5000,      // 5 seconds
  },
  
  // SSE Configuration
  sse: {
    MAX_RECONNECT_ATTEMPTS: 5,
    BASE_RECONNECT_DELAY: 2000,
    MAX_RECONNECT_DELAY: 30000,
  },
  
  // File upload limits
  files: {
    MAX_SIZE_MB: 10,
    ALLOWED_TYPES: [
      'image/jpeg',
      'image/png', 
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ] as string[],
  },
  
  // Validation
  UUID_REGEX: /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i,
  
  // Environment flags
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
} as const;

export default config; 