import * as fs from 'node:fs/promises'
import { resolve } from 'node:path'

const path = resolve(__dirname ?? import.meta.dirname, '../src/lib/useApi.ts')
const content = await fs.readFile(path, 'utf-8')
await fs.writeFile(path, content.replace(/\.\/web\/api\./g, './tauri/api.'))
await fs.rm(resolve(__dirname ?? import.meta.dirname, '../public-web'), { recursive: true, force: true })