import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextRequest, NextResponse } from 'next/server';

// Rate limiter for review submissions: 5 requests per minute per IP
const reviewLimiter = new RateLimiterMemory({
  points: 5, // Number of requests
  duration: 60, // Per 60 seconds
});

// Rate limiter for claim submissions: 3 requests per hour per IP
const claimLimiter = new RateLimiterMemory({
  points: 3, // Number of requests
  duration: 3600, // Per hour
});

// Rate limiter for search/GET requests: 30 requests per minute per IP
const searchLimiter = new RateLimiterMemory({
  points: 30, // Number of requests
  duration: 60, // Per 60 seconds
});

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return '127.0.0.1';
}

export type RateLimitType = 'review' | 'claim' | 'search';

export async function checkRateLimit(
  request: NextRequest,
  type: RateLimitType = 'review'
): Promise<{ success: boolean; response?: NextResponse }> {
  const ip = getClientIP(request);
  
  const limiter = type === 'claim' ? claimLimiter : type === 'search' ? searchLimiter : reviewLimiter;
  
  try {
    await limiter.consume(ip);
    return { success: true };
  } catch {
    const retryAfter = type === 'claim' ? 3600 : 60;
    return {
      success: false,
      response: NextResponse.json(
        { 
          error: 'Prea multe cereri. Te rugăm să aștepți înainte de a încerca din nou.',
          retryAfter 
        },
        { 
          status: 429,
          headers: {
            'Retry-After': String(retryAfter),
          }
        }
      ),
    };
  }
}
