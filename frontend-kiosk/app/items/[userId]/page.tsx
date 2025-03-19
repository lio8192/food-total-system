'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { User } from '@/app/types/user'
import type { Food } from '@/app/types/food'
import { API_URL } from '@/config'
import { OrderRequest } from '@/app/types/order'

export default function ItemSelection({ params }: { params: { userId: string } }) {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: number }>({})
  const [menuItems, setMenuItems] = useState<Food[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError('')
      
      try {
        // 사용자 정보와 음식 목록을 병렬로 가져옵니다
        const [userResponse, foodsResponse] = await Promise.all([
          fetch(`${API_URL}/users/${params.userId}`),
          fetch(`${API_URL}/foods`)
        ])

        const userData = await userResponse.json()
        const foodsData = await foodsResponse.json()

        if (!userResponse.ok) {
          throw new Error(userData.error || '사용자를 찾을 수 없습니다')
        }

        if (!foodsResponse.ok) {
          throw new Error('메뉴 목록을 불러오는데 실패했습니다')
        }

        setUser(userData)
        setMenuItems(foodsData)
      } catch (error) {
        setError(error instanceof Error ? error.message : '데이터를 불러오는데 실패했습니다')
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.userId])

  const handleItemClick = (item: string) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item]: (prev[item] || 0) + 1,
    }))
  }

  const handleQuantityChange = (item: string, quantity: number) => {
    setSelectedItems((prev) => ({
      ...prev,
      [item]: quantity,
    }))
  }

  const handleConfirm = async () => {
    try {
      // 선택된 모든 아이템에 대해 주문 요청을 생성
      const orderPromises = Object.entries(selectedItems).map(([itemName, quantity]) => {
        // menuItems에서 해당 아이템 찾기
        const foodItem = menuItems.find(food => food.item === itemName)
        if (!foodItem) return null

        const orderRequest: OrderRequest = {
          person: parseInt(params.userId),
          item: foodItem.id,
          count: quantity,
          price: foodItem.price
        }

        return fetch(`${API_URL}/calculates`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderRequest)
        })
      }).filter(Boolean) // null 값 제거

      // 모든 주문 요청 처리 대기
      const results = await Promise.all(orderPromises)
      
      // 응답 확인
      const hasError = results.some(res => res && !res.ok)
      if (hasError) {
        throw new Error('주문 처리 중 오류가 발생했습니다.')
      }

      // 성공적으로 처리됐을 경우 확인 페이지로 이동
      router.push('/confirmation')
    } catch (error) {
      setError(error instanceof Error ? error.message : '주문 처리 중 오류가 발생했습니다')
    }
  }

  const handleCancel = () => {
    setSelectedItems({})
    router.push('/')
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">
        {isLoading ? (
          '로딩 중...'
        ) : error ? (
          error
        ) : user ? (
          `${user.name}님의 주문`
        ) : (
          '사용자를 찾을 수 없습니다'
        )}
      </h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {menuItems.map((food) => (
          <Button
            key={food.id}
            onClick={() => handleItemClick(food.item)}
            className="w-40 h-40 text-xl flex flex-col items-center justify-center p-2"
          >
            <Image
              src={`${process.env.NEXT_PUBLIC_IMAGES_URL}${food.img}`}
              alt={food.item}
              width={80}
              height={80}
              className="mb-2 rounded-full"
            />
            <span>{food.item}</span>
            <span className="text-sm text-gray-500">{food.price}원</span>
            {selectedItems[food.item] && (
              <span className="text-sm mt-2">x{selectedItems[food.item]}</span>
            )}
          </Button>
        ))}
      </div>
      <div className="w-full max-w-md space-y-4">
        {Object.entries(selectedItems).map(([item, quantity]) => (
          <div key={item} className="flex items-center justify-between">
            <span className="text-xl">{item}</span>
            <Input
              type="number"
              min="0"
              value={quantity}
              onChange={(e) => handleQuantityChange(item, parseInt(e.target.value) || 0)}
              className="w-20 text-xl"
            />
          </div>
        ))}
      </div>
      <Button onClick={handleConfirm} className="mt-8 w-full max-w-md h-16 text-2xl">
        확인
      </Button>
      <Button onClick={handleCancel} className="mt-4 w-full max-w-md h-16 text-2xl bg-red-600 hover:bg-red-700">
        취소
      </Button>
    </div>
  )
}