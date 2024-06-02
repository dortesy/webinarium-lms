// src/jobs/queue.ts
import { Queue } from 'bullmq';
import { connection } from '@/config/redis-connection';

const transcodingQueue = new Queue('transcodingQueue', { connection });
export { transcodingQueue };