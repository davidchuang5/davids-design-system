import { promises as fs } from 'fs'
import { resolve } from 'path'
import type { RunLogEntry } from '../types.js'

const LOG_PATH = resolve('./run-log.json')

export async function writeRunLog(entry: Omit<RunLogEntry, 'timestamp'>): Promise<void> {
  let entries: RunLogEntry[] = []
  try {
    const raw = await fs.readFile(LOG_PATH, 'utf-8')
    entries = JSON.parse(raw)
  } catch {
    // first run — log doesn't exist yet
  }
  entries.push({ timestamp: new Date().toISOString(), ...entry })
  await fs.writeFile(LOG_PATH, JSON.stringify(entries, null, 2))
}
