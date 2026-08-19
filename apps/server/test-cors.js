async function test() {
  try {
    const res = await fetch("https://credit-union-system-roaaccugh-serve.vercel.app/api/admin/login", {
      method: "OPTIONS",
      headers: {
        "Origin": "https://admin.roaaccugh.com",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type"
      }
    });
    console.log("Status:", res.status);
    console.log("CORS Headers:", res.headers.get("access-control-allow-origin"));
  } catch(e) {
    console.error(e);
  }
}
test();
