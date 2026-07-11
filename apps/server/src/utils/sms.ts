import { KairosSMS } from "@kairosafrika/sms";
import { lastValueFrom } from "rxjs";
import dotenv from "dotenv";

dotenv.config();

const KAIROS_API_KEY = process.env.KAIROS_API_KEY;
const KAIROS_API_SECRET = process.env.KAIROS_API_SECRET;
const SENDER_ID = process.env.SMS_SENDER_ID || "ROAACCU";

/**
 * Sends a single SMS message using Kairos Afrika
 * @param to The recipient phone number
 * @param message The text message content
 * @returns A promise that resolves when the message is accepted by the API
 */
export async function sendSms(to: string, message: string): Promise<any> {
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
    return response;
  } catch (error) {
    console.error(`[Kairos SMS] Failed to send SMS to ${to}:`, error);
    throw error;
  }
}

/**
 * Pings the Kairos API to check SMS balance.
 * Returns the balance data object.
 */
export async function checkSmsBalance(): Promise<any> {
  if (!KAIROS_API_KEY || !KAIROS_API_SECRET) {
    throw new Error("KAIROS_API_KEY or KAIROS_API_SECRET not set in environment variables.");
  }

  try {
    // Check balance using the Kairos SMS module
    const response = await lastValueFrom(
      KairosSMS.account({ apiKey: KAIROS_API_KEY, apiSecret: KAIROS_API_SECRET }).balance()
    );
    return response;
  } catch (error) {
    console.error("[Kairos SMS] Failed to check balance:", error);
    throw error;
  }
}
