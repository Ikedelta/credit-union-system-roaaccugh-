import { KairosSMS } from "@kairosafrika/sms";
import { lastValueFrom } from "rxjs";
import * as dotenv from "dotenv";

dotenv.config();

const KAIROS_API_KEY = process.env.KAIROS_API_KEY;
const KAIROS_API_SECRET = process.env.KAIROS_API_SECRET;
const SENDER_ID = process.env.SMS_SENDER_ID || "ROAACCU";

/**
 * Sends a single SMS message using Kairos Afrika
 */
export const sendSms = async (to: string, message: string): Promise<boolean> => {
  if (!KAIROS_API_KEY || !KAIROS_API_SECRET) {
    throw new Error("KAIROS_API_KEY or KAIROS_API_SECRET not set in environment variables.");
  }

  try {
    const response = await lastValueFrom(
      KairosSMS.send(
        { apiKey: KAIROS_API_KEY, apiSecret: KAIROS_API_SECRET, timeout: 90000 },
        { to, from: SENDER_ID, message }
      ).asQuick()
    );
    
    // Kairos wraps HTTP errors in a success: false payload without throwing
    if (response && response.success === false) {
      console.error(`[Kairos SMS] API Error:`, response.statusMessage);
      return false;
    }
    return true;
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
    // Check balance using the Kairos SMS module
    const response = await lastValueFrom(
      KairosSMS.account({ apiKey: KAIROS_API_KEY, apiSecret: KAIROS_API_SECRET }).balance()
    );
    
    // Sanitize the response to prevent circular JSON errors if Kairos returns an Axios Error object inside `data`
    return {
      success: response?.success,
      statusCode: response?.statusCode,
      statusMessage: response?.statusMessage,
      // Only include data if it's a number/string/simple object, avoid Error objects
      data: response?.data instanceof Error ? response.data.message : response?.data
    };
  } catch (error: any) {
    console.error("[Kairos SMS] Failed to check balance:", error?.message || String(error));
    throw new Error("Failed to check balance");
  }
};
