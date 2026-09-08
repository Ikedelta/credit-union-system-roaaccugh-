async function getError() {
  try {
    const res = await fetch("https://api.github.com/repos/Ikedelta/credit-union-system-roaaccugh-/check-runs/96077274815/annotations");
    const annotations = await res.json();
    console.log(JSON.stringify(annotations, null, 2));
  } catch(e) {
    console.error(e);
  }
}
getError();
