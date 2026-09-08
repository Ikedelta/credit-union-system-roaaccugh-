async function getJobDetails() {
  try {
    const res = await fetch("https://api.github.com/repos/Ikedelta/credit-union-system-roaaccugh-/actions/jobs/96077274815");
    const job = await res.json();
    console.log("Job status:", job.status);
    console.log("Job conclusion:", job.conclusion);
    for (const step of (job.steps || [])) {
      console.log(`- Step ${step.name}: ${step.conclusion}`);
    }
  } catch(e) {
    console.error(e);
  }
}
getJobDetails();
