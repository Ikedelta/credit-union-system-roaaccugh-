async function getJobDetails() {
  try {
    const res = await fetch("https://api.github.com/repos/Ikedelta/credit-union-system-roaaccugh-/actions/jobs/96077274815");
    const job = await res.json();
    for (const step of job.steps) {
      if (step.conclusion === 'failure') {
        console.log(`FAILED STEP: ${step.name}`);
        // Now let's try to get the log for this job
        const logRes = await fetch(`https://api.github.com/repos/Ikedelta/credit-union-system-roaaccugh-/actions/jobs/96077274815/logs`);
        if (logRes.ok) {
           const logText = await logRes.text();
           const lines = logText.split('\n');
           const lastLines = lines.slice(-20); // Get last 20 lines of the log
           console.log("LOGS:", lastLines.join('\n'));
        }
      }
    }
  } catch(e) {
    console.error(e);
  }
}
getJobDetails();
