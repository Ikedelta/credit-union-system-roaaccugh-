async function getJobDetails() {
  try {
    const res = await fetch("https://api.github.com/repos/Ikedelta/credit-union-system-roaaccugh-/actions/jobs/96077274815");
    const job = await res.json();
    console.log(JSON.stringify(job, null, 2));
  } catch(e) {
    console.error(e);
  }
}
getJobDetails();
