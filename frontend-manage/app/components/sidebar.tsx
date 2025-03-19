'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Pizza, Clock, Users, Calculator } from 'lucide-react'

const menuItems = [
  { name: '홈', href: '/', icon: Home },
  { name: '음식 관리', href: '/foods', icon: Pizza },
  { name: '구매 히스토리', href: '/history', icon: Clock },
  { name: '인원 관리', href: '/members', icon: Users },
  { name: '정산', href: '/settlement', icon: Calculator },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col bg-white shadow-lg">
      <div className="flex h-16 items-center justify-center border-b border-gray-200">
        <h1 className="text-xl font-semibold text-gray-800">랩실 음식 정산</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon
                className={`mr-3 h-6 w-6 flex-shrink-0 ${
                  isActive ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500'
                }`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

