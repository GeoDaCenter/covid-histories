import { writeFileSync } from "fs";

const lastUpdated = process.env.LAST_UPDATED || new Date().toISOString()
const path = process.env.TIMESTAMP_PATH || './scripts/last-updated.txt'

const main = () => {
    writeFileSync(path, `"${lastUpdated}"`);
}

main()