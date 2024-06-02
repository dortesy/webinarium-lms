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


const emitEvent = (eventName: string, data: any) => {
    connection.publish('job-events', JSON.stringify({ eventName, data }));
};

worker.on('completed', job => {
    console.log(`Job ${job.id} has completed!`);
    emitEvent('jobCompleted', { jobId: job.id, status: 'completed' });
});

worker.on('failed', (job, err) => {
    console.log(`Job ${job?.id} has failed with ${err.message}`);
    emitEvent('jobFailed', { jobId: job?.id, status: 'failed', error: err.message });
});

export { worker };
