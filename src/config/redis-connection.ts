// src/config/redisConnection.ts
import IORedis from 'ioredis';

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD || '',
    maxRetriesPerRequest: null,
});

export { connection };