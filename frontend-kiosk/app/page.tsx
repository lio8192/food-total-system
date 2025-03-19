'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { User } from './types/user'
import { API_URL } from '@/config'

export default function Home() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`)
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error('사용자 정보를 불러오는데 실패했습니다:', error)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">랩실 식비 정산</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {users.map((user) => (
          <Link key={user.id} href={`/items/${user.id}`}>
            <Button className="w-40 h-20 text-xl">{user.name}</Button>
          </Link>
        ))}
      </div>
      <Link href="/statistics">
        <Button className="w-60 h-16 text-xl bg-green-600 hover:bg-green-700">현재 통계</Button>
      </Link>
    </div>
  )
}

