'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cancelPurchase } from './actions'

interface Purchase {
  id: string
  foodName: string
  price: number
  purchaseDate: string
  purchasedBy: string
  status: 'active' | 'cancelled'
}

export function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    // 실제 구현에서는 서버로부터 구매 히스토리를 가져옵니다.
    setPurchases([
      { id: '1', foodName: '피자', price: 20000, purchaseDate: '2023-05-15', purchasedBy: '김철수', status: 'active' },
      { id: '2', foodName: '치킨', price: 18000, purchaseDate: '2023-05-16', purchasedBy: '이영희', status: 'active' },
    ])
  }, [])

  const handleCancel = async (id: string) => {
    await cancelPurchase(id)
    setPurchases(purchases.map(p => 
      p.id === id ? { ...p, status: 'cancelled' } : p
    ))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>음식 이름</TableHead>
          <TableHead>가격</TableHead>
          <TableHead>구매 날짜</TableHead>
          <TableHead>구매자</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {purchases.map((purchase) => (
          <TableRow key={purchase.id}>
            <TableCell>{purchase.foodName}</TableCell>
            <TableCell>{purchase.price}원</TableCell>
            <TableCell>{purchase.purchaseDate}</TableCell>
            <TableCell>{purchase.purchasedBy}</TableCell>
            <TableCell>{purchase.status === 'active' ? '활성' : '취소됨'}</TableCell>
            <TableCell>
              {purchase.status === 'active' && (
                <Button 
                  variant="destructive" 
                  onClick={() => handleCancel(purchase.id)}
                  disabled={purchase.status === 'cancelled'}
                >
                  취소
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

