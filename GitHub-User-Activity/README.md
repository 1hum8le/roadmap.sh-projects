# 🧰 GitHub User Activity CLI

**GitHub User Activity CLI** is a lightweight, fast, and fully terminal-based tool for fetching and displaying the latest public activity of any GitHub user. Designed with simplicity, modularity, and clarity in mind.

## 🎯 Project Goal

This project helped me with practicing:

- Working with REST APIs (GitHub Events API)
- Handling raw JSON data without external libraries
- Building modular CLI tools in Node.js
- Understanding terminal application architecture

## 🚀 What It Does

- Connects to the GitHub Events API
- Fetches the latest public activity for a given username
- Formats the output into readable lines like:

  ```
- Pushed 12 commits to ALucek/fastapi-template-gcp     
- Pushed 4 commits to ALucek/deep-competitive-analyst  
- Pushed 3 commits to ALucek/pii-masking-rlenv
- Created a new branch in ALucek/pii-masking-rlenv     
- Starred ALucek/fastapi-template-gcp
- Opened a pull request in ALucek/fastapi-template-gcp 
- Created a new branch in ALucek/fastapi-template-gcp  
- Labeled a pull request in ALucek/fastapi-template-gcp
- Opened a pull request in ALucek/fastapi-template-gcp 
- Created a new branch in ALucek/fastapi-template-gcp  

  ```
- Saves the raw data as a `.json` file in `/cache/`
- Handles errors gracefully (invalid usernames, API failures, etc.)

## 🧪 Usage

```bash
gitUserApi <username>
```

Example:

```bash
gitUserApi 1hum8le
```

## 📦 Installation

### Global (recommended)

```bash
npm i @1hum8le/userapi
```

## 🔧 Requirements

- Node.js v18 or higher
- No external HTTP libraries — uses native `https` module

## 🌐 API Reference

GitHub Events API:

```
https://api.github.com/users/<username>/events
```

Example:

```
https://api.github.com/users/1hum8le/events
```

Learn more about the GitHub API [here](https://docs.github.com/en/rest/activity/events?apiVersion=2022-11-28).

---

Made by 1hum8le 
