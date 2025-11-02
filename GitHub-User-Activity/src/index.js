import fetchActivity from './fetchActivity.js';
import formatActivity from './formatActivity.js';
import Utils from './utils.js';
import { argv } from 'node:process';


export async function run() {
  const username = argv[2];
  if (!username) {
    console.error('❌ You must provide a GitHub username');
    process.exit(1);
  }

  try {
    const events = await fetchActivity(username);
    const output = formatActivity(events);
    console.log(output);
  } catch (err) {
    console.error(`❌ Error: ${err.message}`);
  }
}
