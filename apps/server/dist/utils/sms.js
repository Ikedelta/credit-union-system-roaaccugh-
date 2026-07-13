"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSmsTemplate = exports.checkSmsBalance = exports.sendSms = void 0;
const sms_1 = require("@kairosafrika/sms");
const rxjs_1 = require("rxjs");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const KAIROS_API_KEY = process.env.KAIROS_API_KEY;
const KAIROS_API_SECRET = process.env.KAIROS_API_SECRET;
const SENDER_ID = process.env.SMS_SENDER_ID || "ROAACCU";
/**
 * Sends a single SMS message using Kairos Afrika
 */
const sendSms = async (to, message) => {
    if (!KAIROS_API_KEY || !KAIROS_API_SECRET) {
        throw new Error("KAIROS_API_KEY or KAIROS_API_SECRET not set in environment variables.");
    }
    try {
        const response = await (0, rxjs_1.lastValueFrom)(sms_1.KairosSMS.send({ apiKey: KAIROS_API_KEY, apiSecret: KAIROS_API_SECRET, timeout: 90000 }, { to, from: SENDER_ID, message }).asQuick());
        // Kairos wraps HTTP errors in a success: false payload without throwing
        if (response && response.success === false) {
            console.error(`[Kairos SMS] API Error:`, response.statusMessage);
            return false;
        }
        return true;
    }
    catch (error) {
        console.error(`[Kairos SMS] Failed to send SMS to ${to}:`, error?.message || String(error));
        return false;
    }
};
exports.sendSms = sendSms;
/**
 * Pings the Kairos API to check SMS balance.
 */
const checkSmsBalance = async () => {
    if (!KAIROS_API_KEY || !KAIROS_API_SECRET) {
        throw new Error("KAIROS_API_KEY or KAIROS_API_SECRET not set in environment variables.");
    }
    try {
        // Check balance using the Kairos SMS module
        const response = await (0, rxjs_1.lastValueFrom)(sms_1.KairosSMS.account({ apiKey: KAIROS_API_KEY, apiSecret: KAIROS_API_SECRET }).balance());
        // Sanitize the response to prevent circular JSON errors if Kairos returns an Axios Error object inside `data`
        return {
            success: response?.success,
            statusCode: response?.statusCode,
            statusMessage: response?.statusMessage,
            // Only include data if it's a number/string/simple object, avoid Error objects
            data: response?.data instanceof Error ? response.data.message : response?.data
        };
    }
    catch (error) {
        console.error("[Kairos SMS] Failed to check balance:", error?.message || String(error));
        throw new Error("Failed to check balance");
    }
};
exports.checkSmsBalance = checkSmsBalance;
/**
 * Gets an SMS template from the database or returns a default message.
 */
const getSmsTemplate = async (key, defaultMessage, prismaClient) => {
    try {
        const content = await prismaClient.websiteContent.findUnique({ where: { key } });
        return content?.value || defaultMessage;
    }
    catch (err) {
        return defaultMessage;
    }
};
exports.getSmsTemplate = getSmsTemplate;
//# sourceMappingURL=sms.js.map