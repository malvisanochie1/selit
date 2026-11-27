// Daily housekeeping. Clears old records in the database, then deletes the
// photos they leave behind from storage.
//
// Needs SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in the environment.

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.log('Supabase keys are not set yet, skipping.');
  process.exit(0);
}

// New Supabase secret keys (sb_secret_…) go in the apikey header only; older
// JWT keys also need the Authorization header.
const headers = {
  apikey: key,
  ...(key.startsWith('sb_') ? {} : { Authorization: `Bearer ${key}` }),
  'Content-Type': 'application/json',
};

const response = await fetch(`${url}/rest/v1/rpc/run_maintenance`, {
  method: 'POST',
  headers,
  body: '{}',
});
if (!response.ok) {
  throw new Error(`Maintenance failed: ${response.status} ${await response.text()}`);
}

const leftovers = await response.json();
let removed = 0;

for (const [bucket, paths] of Object.entries(leftovers)) {
  for (let start = 0; start < paths.length; start += 100) {
    const prefixes = paths.slice(start, start + 100);
    const result = await fetch(`${url}/storage/v1/object/${bucket}`, {
      method: 'DELETE',
      headers,
      body: JSON.stringify({ prefixes }),
    });
    if (!result.ok) {
      throw new Error(`Could not delete from ${bucket}: ${result.status}`);
    }
    removed += prefixes.length;
  }
}

console.log(`Maintenance done, ${removed} unused photos removed.`);
