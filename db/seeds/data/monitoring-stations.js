import { fileURLToPath } from 'node:url'
import { existsSync, readFileSync } from 'node:fs'

const DATA_FILE = fileURLToPath(new URL('./monitoring-stations.json', import.meta.url))

// The monitoring stations are held in `monitoring-stations.json`. Where there is no file, there are none.
export const data = existsSync(DATA_FILE) ? JSON.parse(readFileSync(DATA_FILE, 'utf8')) : []
