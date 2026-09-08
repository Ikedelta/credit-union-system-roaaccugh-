async function getActions() {
  try {
    const res = await fetch("https://api.github.com/repos/Ikedelta/credit-union-system-roaaccugh-/actions/runs");
    const data = await res.json();
    const run = data.workflow_runs[0];
    console.log(`Run ID: ${run.id}`);
    
    const jobsRes = await fetch(`https://api.github.com/repos/Ikedelta/credit-union-system-roaaccugh-/actions/runs/${run.id}/jobs`);
    const jobsData = await jobsRes.json();
    for (const job of jobsData.jobs) {
      console.log(`Job: ${job.name} | Conclusion: ${job.conclusion}`);
      for (const step of job.steps) {
        if (step.conclusion === 'failure') {
          console.log(`  Failed Step: ${step.name}`);
        }
      }
    }
  } catch(e) {
    console.error(e);
  }
}
getActions();
