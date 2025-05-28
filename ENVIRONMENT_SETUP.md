# Environment Setup for Maisha Care

## Required Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Backend AI Service URL
# This should point to your deployed AI backend service
AI_BACKEND_URL=https://v2deployment-production.up.railway.app

# Node Environment
NODE_ENV=development

# Optional: Enable detailed logging in development
NEXT_PUBLIC_ENABLE_LOGGING=true
```

## Configuration Notes

1. **AI_BACKEND_URL**: This is the most critical variable. Ensure it points to your actual backend service.
   - For production: Use your production backend URL
   - For development: Use your staging/development backend URL

2. **Consistent Backend URLs**: The centralized configuration in `lib/config.ts` now handles all backend communication to prevent the multiple URL conflicts that were causing SSE errors.

3. **Logging**: Set `NEXT_PUBLIC_ENABLE_LOGGING=true` in development to help debug connection issues.

## Troubleshooting SSE Issues

If you're still experiencing SSE connection errors after applying the fixes:

1. Check that your `AI_BACKEND_URL` environment variable is set correctly
2. Ensure your backend service is actually running and accessible
3. Check the browser's Network tab for failed SSE connections
4. Look for console errors related to "NoConsultationID" or "InvalidConsultationID"
5. Verify that the backend service supports the SSE endpoint: `/consultation/{id}/events`

## What Was Fixed

1. **Inconsistent Backend URLs**: All services now use the centralized config
2. **Dual Connection Attempts**: Removed conflicting direct/proxy connection logic
3. **SSE Race Conditions**: Improved consultation ID synchronization
4. **Timeout Mismatches**: Unified timeout configuration
5. **Missing Validation**: Added proper UUID validation for consultation IDs 