// import fs from 'node:fs'
// import fetch from 'node-fetch'

// const username = '1hum8le'
// const fetchUserAPI = await fetch(`https://api.github.com/users/${username}/events`)
// const response = await fetchUserAPI.json()

// fs.writeFileSync(`./test/${username}.json`, JSON.stringify(response, null, 2));


// const raw = fs.readFileSync(`./test/${username}.json`, 'utf-8')
// const parsed = JSON.parse(raw)

// console.log(parsed);

import fetchActivity from "../src/fetchActivity.js"

fetchActivity(`ALucek`)
fetchActivity(`1hum8le`)