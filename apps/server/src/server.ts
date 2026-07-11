import dotenv from "dotenv";
dotenv.config(); // Must be before any other import that uses process.env

import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📱 Kairos Afrika SMS: ${process.env.KAIROS_API_KEY && process.env.KAIROS_API_SECRET ? '✅ Configured' : '❌ Missing API Keys'}`);
});