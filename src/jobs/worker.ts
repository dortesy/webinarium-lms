// src/jobs/worker.ts
import { Worker } from 'bullmq';
import { connection } from '@/config/redis-connection';
import { transcodeVideo } from '@/jobs/processors';

const worker = new Worker('transcodingQueue', async job => {
    if (job) {
        const { filePath, mediaId } = job.data;
        await transcodeVideo(filePath, mediaId);
    }
}, { connection });

worker.on('completed', job => {
    if (job) {
        console.log(`Job ${job.id} has completed!`);
    }
});

worker.on('failed', (job, err) => {
    if (job) {
        console.log(`Job ${job.id} has failed with ${err.message}`);
    }
});

export { worker };
