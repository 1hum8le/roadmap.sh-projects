import Utils from "./utils.js";
import chalk from "chalk";
import boxen from "boxen";

export default function formatActivity(events) {
  if (!Array.isArray(events)) return 'Printing Activity impossible.';

  const output = [];
  const pushMap = new Map();

  for (const event of events) {
    const repo = event.repo?.name || 'unknown repo';
    const type = event.type;

    switch (type) {
      case 'PushEvent': {
        const commits = event.payload?.commits;
        const count = commits?.length ?? 1;
        const prev = pushMap.get(repo) ?? 0;
        pushMap.set(repo, prev + count);
        break;
      }

      case 'IssuesEvent': {
        const action = event.payload?.action || 'updated';
        output.push(`- ${capitalize(action)} an issue in ${repo}`);
        break;
      }

      case 'IssueCommentEvent':
        output.push(`- Commented on an issue in ${repo}`);
        break;

      case 'WatchEvent':
        output.push(`- Starred ${repo}`);
        break;

      case 'CreateEvent': {
        const refType = event.payload?.ref_type || 'something';
        output.push(`- Created a new ${refType} in ${repo}`);
        break;
      }

      case 'ForkEvent':
        output.push(`- Forked ${repo}`);
        break;

      case 'PullRequestEvent': {
        const action = event.payload?.action || 'updated';
        output.push(`- ${capitalize(action)} a pull request in ${repo}`);
        break;
      }

      default:
        break;
    }
  }

  // dodajemy podsumowania pushów
  for (const [repo, totalCommits] of pushMap.entries()) {
    output.unshift(`- Pushed ${totalCommits} commit${totalCommits !== 1 ? 's' : ''} to ${repo}`);
  }

  return output.join('\n');
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
