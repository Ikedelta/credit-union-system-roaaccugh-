import dotenv from "dotenv";
dotenv.config();

import { checkSmsBalance, sendSms } from "./src/utils/sms";

async function testSMS() {
  console.log("=== Testing SMS API ===");

  try {
    // 1. Test SMS Balance / Connectivity
    console.log("Checking Balance...");
    const balance = await checkSmsBalance();
    console.log("✅ Balance Response:", JSON.stringify(balance, null, 2));

    // 2. To test sending an SMS, uncomment the lines below and add a real phone number
    // const testNumber = "+233XXXXXXXXX"; // Replace with your test number
    // console.log(`\nSending test message to ${testNumber}...`);
    // const success = await sendSms(testNumber, "This is a test message from the ROAACCU terminal.");
    // if (success) {
    //   console.log("✅ Message sent successfully!");
    // } else {
    //   console.log("❌ Failed to send message.");
    // }
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testSMS();
