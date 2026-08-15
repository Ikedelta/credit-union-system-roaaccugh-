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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const KAIROS_API_KEY = process.env.KAIROS_API_KEY;
const KAIROS_API_SECRET = process.env.KAIROS_API_SECRET;
const SENDER_ID = process.env.SMS_SENDER_ID || "ROAACCU";
const BASE_URL = "https://api.kairosafrika.com/v1";
/**
 * Sends a single SMS message using Kairos Afrika
 */
const sendSms = async (to, message) => {
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