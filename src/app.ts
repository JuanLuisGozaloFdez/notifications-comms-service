import express from 'express';
import cors from 'cors';
import notificationsRouter from './routes/notifications';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'notifications-comms-service' }));

app.use('/notifications', notificationsRouter);

// 404 handler
app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

export default app;
