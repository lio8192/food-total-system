import { NextResponse } from 'next/server'
import type { User } from '@/app/types/user'

const users: User[] = []

export async function GET() {
  return NextResponse.json(users)
}