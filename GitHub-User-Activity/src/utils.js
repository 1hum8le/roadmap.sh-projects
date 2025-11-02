import fs from 'node:fs';
import path from 'node:path';

export default class Utils {
  jsonSave(username, data) {
    const filePath = path.resolve('./cache', `${username}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  }

  jsonLoad(username) {
    const filePath = path.resolve('./cache', `${username}.json`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  }
}
