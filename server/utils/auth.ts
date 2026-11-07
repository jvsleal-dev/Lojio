import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import type { H3Event } from 'h3'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-e-commerce-saas-key-2026'

export interface AuthUser {
  id: string
  email: string
  name: string
  tenantId?: string | null
  role: string
}

export function generateToken(payload: AuthUser): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

export function getAuthenticatedUser(event: H3Event): AuthUser {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Não autorizado. Token não informado.',
    })
  }

  const token = authHeader.split(' ')[1]
  const user = verifyToken(token)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Sessão expirada ou token inválido.',
    })
  }

  return user
}

export const requireAuth = getAuthenticatedUser

export function getMasterAdminUser(event: H3Event): AuthUser {
  const user = getAuthenticatedUser(event)
  if (user.role !== 'SUPERADMIN' && user.role !== 'MASTER') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Acesso restrito ao Administrador Geral da Plataforma.',
    })
  }
  return user
}

export async function resolveTenantId(event: H3Event, user: AuthUser): Promise<string> {
  let tenantId = user.tenantId
  if (!tenantId && (user.role === 'SUPERADMIN' || user.role === 'MASTER')) {
    const query = getQuery(event)
    const headerTenant = getHeader(event, 'x-tenant-id')
    const requestedTenantId = ((query.tenantId as string) || headerTenant)?.trim()

    if (requestedTenantId) {
      const match = await prisma.tenant.findUnique({ where: { id: requestedTenantId } })
      if (match) return match.id
    }

    const firstTenant = await prisma.tenant.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    })
    tenantId = firstTenant?.id || null
  }

  if (!tenantId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nenhuma loja associada a esta conta.',
    })
  }

  return tenantId
}

