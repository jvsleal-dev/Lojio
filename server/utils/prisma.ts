import { PrismaClient } from '@prisma/client'
import path from 'node:path'
import fs from 'node:fs'

declare global {
  var __prisma: PrismaClient | undefined
}

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('file:.')) {
    return process.env.DATABASE_URL
  }

  const possiblePaths = [
    path.resolve(process.cwd(), 'prisma/dev.db'),
    path.resolve(process.cwd(), '../prisma/dev.db'),
    path.resolve(process.cwd(), '../../prisma/dev.db'),
    'C:/Users/j.Vitor/loja online/prisma/dev.db',
  ]

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return `file:${p.replace(/\\/g, '/')}`
    }
  }

  return 'file:C:/Users/j.Vitor/loja online/prisma/dev.db'
}

const dbUrl = getDatabaseUrl()

export const prisma = globalThis.__prisma || new PrismaClient({
  datasources: process.env.DATABASE_URL
    ? { db: { url: process.env.DATABASE_URL } }
    : { db: { url: getDatabaseUrl() } },
})

globalThis.__prisma = prisma
