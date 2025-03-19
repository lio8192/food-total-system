'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface OrderHistory {
  id: number;
  name: string;
  item: string;
  quantity: number;
  date: string;
}

export default function History() {
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([])

  useEffect(() => {
    // 실제 구현에서는 이 부분을 서버에서 데이터를 가져오는 API 호출로 대체해야 합니다.
    const mockHistory: OrderHistory[] = [
      { id: 1, name: '김철수', item: '김밥', quantity: 2, date: '2023-06-01 10:30' },
      { id: 2, name: '이영희', item: '라면', quantity: 1, date: '2023-06-01 12:15' },
      { id: 3, name: '박민수', item: '돈까스', quantity: 1, date: '2023-06-02 11:45' },
      { id: 4, name: '정지은', item: '비빔밥', quantity: 1, date: '2023-06-02 13:00' },
      { id: 5, name: '최동욱', item: '우동', quantity: 2, date: '2023-06-03 11:30' },
    ]
    setOrderHistory(mockHistory)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8">주문 히스토리</h1>
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">주문 번호</th>
              <th className="px-4 py-2 text-left">이름</th>
              <th className="px-4 py-2 text-left">품목</th>
              <th className="px-4 py-2 text-left">수량</th>
              <th className="px-4 py-2 text-left">날짜</th>
            </tr>
          </thead>
          <tbody>
            {orderHistory.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="px-4 py-2">{order.id}</td>
                <td className="px-4 py-2">{order.name}</td>
                <td className="px-4 py-2">{order.item}</td>
                <td className="px-4 py-2">{order.quantity}</td>
                <td className="px-4 py-2">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link href="/statistics" className="mt-8">
        <Button className="w-40 h-16 text-xl">돌아가기</Button>
      </Link>
    </div>
  )
}

