import { createServer } from 'http';
import next from 'next';
import { Server as SocketServer } from 'socket.io';
import { connection } from './src/config/redis-connection';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const httpServer = createServer(handle);

    const io = new SocketServer(httpServer);
    const subClient = connection.duplicate();


    io.on('connection', (socket) => {
        console.log('a user connected');
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
    });

    httpServer.listen(3000, () => {
        console.log('> Ready on http://localhost:3000');
    });


    (global as any).io = io;

    subClient.subscribe('job-events');

    subClient.on('message', (channel, message) => {
        if (channel === 'job-events') {
            const { eventName, data } = JSON.parse(message);
            io.emit(eventName, data);
        }
    });
});