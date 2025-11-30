const twilio = require('twilio');

// Initialize Twilio client (uses environment variables for credentials)
const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID || 'AC_TEST', process.env.TWILIO_AUTH_TOKEN || 'test');

export const sendSMS = async (to: string, message: string) => {
  try {
    const result = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER || '+1234567890',
      to
    });
    return { success: true, sid: result.sid };
  } catch (err: any) {
    throw new Error(`SMS send failed: ${err.message}`);
  }
};

export const sendBulkSMS = async (recipients: string[], message: string) => {
  const results = [];
  for (const phone of recipients) {
    try {
      const result = await sendSMS(phone, message);
      results.push({ phone, ...result });
    } catch (err: any) {
      results.push({ phone, success: false, error: err.message });
    }
  }
  return results;
};
