async function testLogin() {
  try {
    const res = await fetch("https://credit-union-system-roaaccugh-serve.vercel.app/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "admin@roaaccugh.com", password: "wrongpassword" }) // Just testing connection, should return 401 JSON not 500 HTML
    });
    const text = await res.text();
    console.log("Status:", res.status);
    console.log("Body:", text);
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
testLogin();
