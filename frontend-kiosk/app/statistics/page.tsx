'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

interface OrderData {
  [name: string]: {
    [item: string]: number
  }
}

interface MenuItem {
  name: string;
  image: string;
}

const menuItems: MenuItem[] = [
  { name: '김밥', image: '/placeholder.svg?height=50&width=50' },
  { name: '라면', image: '/placeholder.svg?height=50&width=50' },
  { name: '떡볶이', image: '/placeholder.svg?height=50&width=50' },
  { name: '우동', image: '/placeholder.svg?height=50&width=50' },
  { name: '돈까스', image: '/placeholder.svg?height=50&width=50' },
  { name: '비빔밥', image: '/placeholder.svg?height=50&width=50' },
];

export default function Statistics() {
  const router = useRouter()
  const [orderData, setOrderData] = useState<OrderData>({})

  useEffect(() => {
    // 실제 구현에서는 이 부분을 서버에서 데이터를 가져오는 API 호출로 대체해야 합니다.
    const mockData: OrderData = {
      '김철수': { '김밥': 2, '라면': 1 },
      '이영희': { '떡볶이': 1, '우동': 1 },
      '박민수': { '돈까스': 1 },
      '정지은': { '비빔밥': 1, '김밥': 1 },
      '최동욱': { '라면': 2 },
      '한미영': { '우동': 1, '비빔밥': 1 },
    }
    setOrderData(mockData)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">현재 통계</h1>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">이름</th>
              {menuItems.map(item => (
                <th key={item.name} className="px-4 py-2 text-center">
                  <div className="flex flex-col items-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                      className="mb-2 rounded-full"
                    />
                    <span>{item.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Object.entries(orderData).map(([name, orders]) => (
              <tr key={name} className="border-t">
                <td className="px-4 py-2 font-medium">{name}</td>
                {menuItems.map(item => (
                  <td key={item.name} className="px-4 py-2 text-center">
                    {orders[item.name] || 0}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Button 
        className="w-40 h-16 text-xl mt-8 bg-blue-600 hover:bg-blue-700"
        onClick={() => router.push('/history')}
      >
        주문 히스토리
      </Button>
      <Link href="/" className="mt-8">
        <Button className="w-40 h-16 text-xl">돌아가기</Button>
      </Link>
    </div>
  )
}

