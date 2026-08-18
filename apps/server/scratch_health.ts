async function checkHealth() {
  try {
    const res = await fetch("https://credit-union-system-roaaccugh-serve.vercel.app/api/health");
    console.log(await res.text());
  } catch(err) {
    console.error(err);
  }
}
checkHealth();
