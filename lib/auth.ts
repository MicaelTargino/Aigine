import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'

const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'default-secret-change-in-production'
)

export async function verifyAuth(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')
  
  if (!token) return false
  
  try {
    const { payload } = await jwtVerify(token.value, secret)
    return payload.authenticated === true
  } catch {
    return false
  }
}

export async function signIn(username: string, password: string): Promise<boolean> {
  const adminUser = process.env.ADMIN_USER || 'admin'
  const adminPass = process.env.ADMIN_PASS || 'changeme123'
  
  if (username !== adminUser) return false
  
  // In production, the admin password should already be hashed in env
  // For simplicity, we're doing plain comparison here
  if (password !== adminPass) return false
  
  const token = await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(secret)
  
  const cookieStore = await cookies()
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  })
  
  return true
}

export async function signOut() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}