// Octokit.js
// https://github.com/octokit/core.js#readme

import Utils from "./utils.js";
import fetch from "node-fetch";
const utils = new Utils()

export default async function fetchActivity(username) {

    try {

const fetchUserAPI = await fetch(`https://api.github.com/users/${username}/events`)
const response = await fetchUserAPI.json()
utils.jsonSave(username, response)

// const raw = fs.readFileSync(`./test/${username}.json`, 'utf-8')
// const parsed = JSON.parse(raw)
// console.log(parsed);

    } catch (err) {
        console.error(`Failing Fetching UserAPIData! - ${err}`);
    }
}
