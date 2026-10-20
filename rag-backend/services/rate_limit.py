import os

from dotenv import load_dotenv
from fastapi import HTTPException
from upstash_redis.asyncio import Redis
from upstash_ratelimit.asyncio import Ratelimit, SlidingWindow

load_dotenv()

redis_url = os.getenv("UPSTASH_REDIS_REST_URL")
redis_token = os.getenv("UPSTASH_REDIS_REST_TOKEN")
rate_limiter = None

if redis_url and redis_token:
    rate_limiter = Ratelimit(
        redis=Redis(url=redis_url, token=redis_token),
        limiter=SlidingWindow(max_requests=10, window=60),
        prefix="physical-ai-chat",
    )


async def enforce_rate_limit(identifier: str):
    if rate_limiter is None:
        raise HTTPException(status_code=503, detail="Rate limiting is not configured")

    result = await rate_limiter.limit(identifier)
    if not result.allowed:
        raise HTTPException(status_code=429, detail="Too many chat requests. Please try again shortly.")
