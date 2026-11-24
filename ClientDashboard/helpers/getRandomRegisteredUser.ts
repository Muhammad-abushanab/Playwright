import { readFileSync } from 'node:fs';


export function getRandomEmail(): string {
    const filePath = 'test-data/RegisteredUsers.csv';
    const content = readFileSync(filePath, 'utf8').trim();
    const rows = content.split(/\r?\n/).slice(1);
    if (rows.length === 0) {
        throw new Error('CSV file has no user rows.');
    }
    const randomRow = rows[Math.floor(Math.random() * rows.length)];
    const columns = randomRow.split(',');
    return columns[2].trim();
}