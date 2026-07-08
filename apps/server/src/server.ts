import dotenv from "dotenv";
dotenv.config(); // Must be before any other import that uses process.env

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📱 Arkesel SMS: ${process.env.ARKESEL_API_KEY ? '✅ Configured' : '❌ Missing API Key'}`);
});