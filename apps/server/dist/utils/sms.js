"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = sendSms;
exports.checkSmsBalance = checkSmsBalance;
const sms_1 = require("@kairosafrika/sms");
const rxjs_1 = require("rxjs");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const KAIROS_API_KEY = process.env.KAIROS_API_KEY;
const KAIROS_API_SECRET = process.env.KAIROS_API_SECRET;
const SENDER_ID = process.env.SMS_SENDER_ID || "ROAACCU";
/**
 * Sends a single SMS message using Kairos Afrika
 * @param to The recipient phone number
 * @param message The text message content
 * @returns A promise that resolves when the message is accepted by the API
 */
async function sendSms(to, message) {
    if (!KAIROS_API_KEY || !KAIROS_API_SECRET) {
        throw new Error("KAIROS_API_KEY or KAIROS_API_SECRET not set in environment variables.");
    }
    try {
        const response = await (0, rxjs_1.lastValueFrom)(sms_1.KairosSMS.send({ apiKey: KAIROS_API_KEY, apiSecret: KAIROS_API_SECRET, timeout: 90000 }, { to, from: SENDER_ID, message }).asQuick());
        return response;
    }
    catch (error) {
        console.error(`[Kairos SMS] Failed to send SMS to ${to}:`, error);
        throw error;
    }
}
/**
 * Pings the Kairos API to check SMS balance.
 * Returns the balance data object.
 */
async function checkSmsBalance() {
    if (!KAIROS_API_KEY || !KAIROS_API_SECRET) {
        throw new Error("KAIROS_API_KEY or KAIROS_API_SECRET not set in environment variables.");
    }
    try {
        // Check balance using the Kairos SMS module
        const response = await (0, rxjs_1.lastValueFrom)(sms_1.KairosSMS.account({ apiKey: KAIROS_API_KEY, apiSecret: KAIROS_API_SECRET }).balance());
        return response;
    }
    catch (error) {
        console.error("[Kairos SMS] Failed to check balance:", error);
        throw error;
    }
}
//# sourceMappingURL=sms.js.map