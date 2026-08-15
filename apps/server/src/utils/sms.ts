import * as dotenv from "dotenv";

dotenv.config();

const KAIROS_API_KEY = process.env.KAIROS_API_KEY;
const KAIROS_API_SECRET = process.env.KAIROS_API_SECRET;
const SENDER_ID = process.env.SMS_SENDER_ID || "ROAACCU";
const BASE_URL = "https://api.kairosafrika.com/v1";

/**
 * Sends a single SMS message using Kairos Afrika
 */
export const sendSms = async (to: string, message: string): Promise<boolean> => {
  if (!KAIROS_API_KEY || !KAIROS_API_SECRET) {
    throw new Error("KAIROS_API_KEY or KAIROS_API_SECRET not set in environment variables.");
  }

  try {
    const response = await fetch(`${BASE_URL}/external/sms/quick`, {
      method: 'POST',
      headers: {
        'x-api-key': KAIROS_API_KEY,
        'x-api-secret': KAIROS_API_SECRET,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ to, from: SENDER_ID, message })
    });
    
    const data = await response.json().catch(() => null);
    
    if (data && data.success === false) {
      console.error(`[Kairos SMS] API Error:`, data.statusMessage);
      return false;
    }
    return response.ok;
  } catch (error: any) {
    console.error(`[Kairos SMS] Failed to send SMS to ${to}:`, error?.message || String(error));
    return false;
  }
};

/**
 * Pings the Kairos API to check SMS balance.
 */
export const checkSmsBalance = async (): Promise<any> => {
  if (!KAIROS_API_KEY || !KAIROS_API_SECRET) {
    throw new Error("KAIROS_API_KEY or KAIROS_API_SECRET not set in environment variables.");
  }

  try {
    const response = await fetch(`${BASE_URL}/external/account/balance`, {
      headers: {
        'x-api-key': KAIROS_API_KEY,
        'x-api-secret': KAIROS_API_SECRET
      }
    });
    
    const data = await response.json().catch(() => null);
    
    return {
      success: data?.success || response.ok,
      statusCode: data?.statusCode || response.status,
      statusMessage: data?.statusMessage || response.statusText,
      data: data?.data
    };
  } catch (error: any) {
    console.error("[Kairos SMS] Failed to check balance:", error?.message || String(error));
    throw new Error("Failed to check balance");
  }
};

/**
 * Gets an SMS template from the database or returns a default message.
 */
export const getSmsTemplate = async (key: string, defaultMessage: string, prismaClient: any): Promise<string> => {
  try {
    const content = await prismaClient.websiteContent.findUnique({ where: { key } });
    return content?.value || defaultMessage;
  } catch (err) {
    return defaultMessage;
  }
};
