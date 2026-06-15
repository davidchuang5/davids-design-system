import { promises as fs } from 'fs'
import { dirname } from 'path'

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.mkdir(dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, content, 'utf-8')
  console.log(`  wrote ${filePath}`)
}

export async function mkdir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true })
}
