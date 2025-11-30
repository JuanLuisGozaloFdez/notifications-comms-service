import express from 'express';
import * as notificationController from '../controllers/notificationController';

const router = express.Router();

router.post('/email', notificationController.sendEmailHandler);
router.post('/sms', notificationController.sendSMSHandler);
router.post('/webhooks', notificationController.registerWebhookHandler);
router.post('/webhooks/deliver', notificationController.deliverWebhookHandler);
router.get('/webhooks', notificationController.listWebhooksHandler);
router.delete('/webhooks/:id', notificationController.deleteWebhookHandler);

export default router;
