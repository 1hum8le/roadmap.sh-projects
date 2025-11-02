import fetch from 'node-fetch';
import Utils from './utils.js';

const utils = new Utils();

export default async function fetchActivity(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/events`);
    const data = await res.json();

    if (res.status === 404) {
      console.error(`User "${username}" not found.`);
      return null;
    }

    utils.jsonSave(username, data);
    return data;
  } catch (err) {
    throw new Error(`Failed to fetch GitHub data: ${err.message}`);
  }
}
