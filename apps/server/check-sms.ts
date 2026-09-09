import { checkSmsBalance } from './src/utils/sms';

async function check() {
  try {
    const balance = await checkSmsBalance();
    console.log("SMS Balance:", JSON.stringify(balance, null, 2));
  } catch (err) {
    console.error(err);
  }
}

check();
