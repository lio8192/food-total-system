'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cancelPurchase } from './actions'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

interface Purchase {
  id: number
  itemName: string
  price: number
  createAt: string
  personName: string
  status: string
}

export function PurchaseHistory() {
  const [purchases, setPurchases] = useState<Purchase[]>([])

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await fetch(`${API_URL}/calculates`)
        const data = await response.json()
        setPurchases(data)
      } catch (error) {
        console.error('구매 내역을 불러오는데 실패했습니다:', error)
      }
    }

    fetchPurchases()
  }, [])

  const handleCancel = async (id: number) => {
    try {
      await cancelPurchase(id);
      // 성공적으로 취소된 경우에만 상태 업데이트
      setPurchases(purchases.map(p => 
        p.id === id ? { ...p, status: '취소됨' } : p
      ));
    } catch (error) {
      console.error('주문 취소 실패:', error);
      // 에러 처리를 위한 사용자 피드백을 추가할 수 있습니다
    }
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
            <TableCell>{purchase.itemName}</TableCell>
            <TableCell>{purchase.price}원</TableCell>
            <TableCell>{new Date(purchase.createAt).toLocaleString()}</TableCell>
            <TableCell>{purchase.personName}</TableCell>
            <TableCell>{purchase.status}</TableCell>
            <TableCell>
              {purchase.status === '활성상태' && (
                <Button 
                  variant="destructive" 
                  onClick={() => handleCancel(purchase.id)}
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

