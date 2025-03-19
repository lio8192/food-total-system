'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { completeSettlement } from './actions'
import { toast, Toaster } from 'sonner'

interface OwnerAmount {
  amount: number
  ownerName: string
  ownerId: number
}

interface Settlement {
  personName: string
  totalUnsettled: number
  personId: number
  ownerAmounts: OwnerAmount[]
}

export function SettlementList() {
  const [settlements, setSettlements] = useState<Settlement[]>([])

  useEffect(() => {
    fetchSettlements()
  }, [])

  const fetchSettlements = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calculates/unsettled-summary`)
      if (!response.ok) throw new Error('Failed to fetch settlements')
      const data = await response.json()
      setSettlements(data)
    } catch (error) {
      console.error('Error fetching settlements:', error)
    }
  }

  const handleComplete = async (personId: number) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/calculates/${personId}/complete`, {
        method: 'POST',
      })
      
      if (!response.ok) throw new Error('Failed to complete settlement')
      
      // 성공적으로 정산이 완료되면 목록에서 제거
      setSettlements(settlements.filter(s => s.personId !== personId))
      toast.success('정산이 완료되었습니다.')
    } catch (error) {
      console.error('Error completing settlement:', error)
      toast.error('정산 처리 중 오류가 발생했습니다.')
    }
  }

  return (
    <>
      <Toaster />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>이름</TableHead>
            <TableHead>정산 금액</TableHead>
            <TableHead>상세 정보</TableHead>
            <TableHead>작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {settlements.map((settlement) => (
            <TableRow key={settlement.personId}>
              <TableCell>{settlement.personName}</TableCell>
              <TableCell>{settlement.totalUnsettled.toLocaleString()}원</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">상세 보기</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{settlement.personName}의 정산 상세</DialogTitle>
                    </DialogHeader>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>받을 사람</TableHead>
                          <TableHead>금액</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {settlement.ownerAmounts.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell>{detail.ownerName}</TableCell>
                            <TableCell>{detail.amount.toLocaleString()}원</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell>
                <Button onClick={() => handleComplete(settlement.personId)}>정산 완료</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}

