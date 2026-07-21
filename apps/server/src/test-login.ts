import fetch from "cross-fetch";

async function main() {
  try {
    console.log("Testing server connectivity...");
    const health = await fetch("http://localhost:3000/api/health");
    console.log("Health:", await health.text());

    console.log("Testing login...");
    const res = await fetch("http://localhost:3000/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@creditunion.com", password: "admin123" })
    });
    console.log("Login status:", res.status);
    console.log("Login response:", await res.json());
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
