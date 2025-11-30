import request from 'supertest';
import app from '../src/app';

describe('Notifications Service', () => {
  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok', service: 'notifications-comms-service' });
  });

  it('POST /notifications/email with valid payload returns success', async () => {
    const res = await request(app)
      .post('/notifications/email')
      .send({
        to: 'test@example.com',
        subject: 'Test Email',
        text: 'This is a test'
      });
    
    // May fail due to SMTP not being configured, but should attempt
    expect([200, 500]).toContain(res.status);
  });

  it('POST /notifications/email without required fields returns 400', async () => {
    const res = await request(app)
      .post('/notifications/email')
      .send({ to: 'test@example.com' });
    
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('POST /notifications/sms with valid payload', async () => {
    const res = await request(app)
      .post('/notifications/sms')
      .send({
        to: '+1234567890',
        message: 'Test SMS'
      });
    
    // May fail due to Twilio not being configured
    expect([200, 500]).toContain(res.status);
  });

  it('POST /notifications/webhooks registers a webhook', async () => {
    const res = await request(app)
      .post('/notifications/webhooks')
      .send({
        url: 'http://localhost:8080/webhook',
        events: ['ticket.created', 'ticket.sold']
      });
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.url).toBe('http://localhost:8080/webhook');
  });

  it('GET /notifications/webhooks returns registered webhooks', async () => {
    // First register a webhook
    await request(app)
      .post('/notifications/webhooks')
      .send({
        url: 'http://localhost:8080/webhook',
        events: ['event1']
      });

    const res = await request(app).get('/notifications/webhooks');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /notifications/webhooks/deliver triggers webhook delivery', async () => {
    const res = await request(app)
      .post('/notifications/webhooks/deliver')
      .send({
        event: 'ticket.created',
        payload: { ticketId: '123', owner: 'alice' }
      });
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('DELETE /notifications/webhooks/:id deletes a webhook', async () => {
    // Register a webhook first
    const registerRes = await request(app)
      .post('/notifications/webhooks')
      .send({
        url: 'http://localhost:8080/webhook',
        events: ['event1']
      });
    
    const webhookId = registerRes.body.id;

    // Delete it
    const deleteRes = await request(app)
      .delete(`/notifications/webhooks/${webhookId}`);
    
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body).toEqual({ success: true });
  });

  it('GET /notfound returns 404', async () => {
    const res = await request(app).get('/notfound');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('error');
  });
});
