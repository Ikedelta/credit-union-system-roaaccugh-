async function test() {
  try {
    const res = await fetch("https://credit-union-system-roaaccugh-serve.vercel.app/api/health");
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  } catch(e) {
    console.error(e);
  }
}
test();
