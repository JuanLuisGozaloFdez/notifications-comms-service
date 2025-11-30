import { Request, Response } from 'express';
import * as emailService from '../services/emailService';
import * as smsService from '../services/smsService';
import * as webhookService from '../services/webhookService';

export const sendEmailHandler = async (req: Request, res: Response) => {
  try {
    const { to, subject, text, html } = req.body;
    if (!to || !subject || !text) {
      return res.status(400).json({ error: 'to, subject, and text are required' });
    }
    const result = await emailService.sendEmail(to, subject, text, html);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const sendSMSHandler = async (req: Request, res: Response) => {
  try {
    const { to, message } = req.body;
    if (!to || !message) {
      return res.status(400).json({ error: 'to and message are required' });
    }
    const result = await smsService.sendSMS(to, message);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const registerWebhookHandler = async (req: Request, res: Response) => {
  try {
    const { url, events } = req.body;
    if (!url || !events || !Array.isArray(events)) {
      return res.status(400).json({ error: 'url and events array are required' });
    }
    const webhook = webhookService.registerWebhook(url, events);
    res.status(201).json(webhook);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deliverWebhookHandler = async (req: Request, res: Response) => {
  try {
    const { event, payload } = req.body;
    if (!event || !payload) {
      return res.status(400).json({ error: 'event and payload are required' });
    }
    const results = await webhookService.deliverWebhook(event, payload);
    res.status(200).json(results);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const listWebhooksHandler = (_req: Request, res: Response) => {
  const webhooks = webhookService.getWebhooks();
  res.status(200).json(webhooks);
};

export const deleteWebhookHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = webhookService.deleteWebhook(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Webhook not found' });
    }
    res.status(200).json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
