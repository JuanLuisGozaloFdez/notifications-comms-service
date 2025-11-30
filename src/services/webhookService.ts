const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

interface Webhook {
  id: string;
  url: string;
  events: string[];
  retries: number;
  createdAt: string;
}

const webhooks: Webhook[] = [];

export const registerWebhook = (url: string, events: string[]) => {
  const webhook: Webhook = {
    id: uuidv4(),
    url,
    events,
    retries: 3,
    createdAt: new Date().toISOString()
  };
  webhooks.push(webhook);
  return webhook;
};

export const deliverWebhook = async (event: string, payload: any) => {
  const results = [];
  
  for (const webhook of webhooks) {
    if (!webhook.events.includes(event)) continue;

    let success = false;
    let lastError = '';

    // Retry logic
    for (let attempt = 1; attempt <= webhook.retries; attempt++) {
      try {
        await axios.post(webhook.url, { event, payload, timestamp: new Date().toISOString() }, {
          timeout: 5000
        });
        success = true;
        break;
      } catch (err: any) {
        lastError = err.message;
        // Exponential backoff between retries
        if (attempt < webhook.retries) {
          await new Promise((resolve) => setTimeout(resolve, Math.pow(2, attempt) * 100));
        }
      }
    }

    results.push({
      webhookId: webhook.id,
      event,
      success,
      error: lastError || undefined
    });
  }

  return results;
};

export const getWebhooks = () => webhooks;

export const deleteWebhook = (id: string) => {
  const index = webhooks.findIndex((w) => w.id === id);
  if (index === -1) return false;
  webhooks.splice(index, 1);
  return true;
};
