async function getError() {
  try {
    const res = await fetch("https://api.github.com/repos/Ikedelta/credit-union-system-roaaccugh-/check-runs/96077274815");
    const check = await res.json();
    console.log(JSON.stringify(check.output, null, 2));
  } catch(e) {
    console.error(e);
  }
}
getError();
