'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { completeSettlement } from './actions'

interface Settlement {
  id: string
  name: string
  amount: number
  details: { recipient: string; amount: number }[]
}

export function SettlementList() {
  const [settlements, setSettlements] = useState<Settlement[]>([])

  useEffect(() => {
    // 실제 구현에서는 서버로부터 정산 정보를 가져옵니다.
    setSettlements([
      { 
        id: '1', 
        name: '김철수', 
        amount: 30000, 
        details: [
          { recipient: '이영희', amount: 15000 },
          { recipient: '박지성', amount: 15000 },
        ]
      },
      { 
        id: '2', 
        name: '이영희', 
        amount: 20000, 
        details: [
          { recipient: '김철수', amount: 10000 },
          { recipient: '박지성', amount: 10000 },
        ]
      },
    ])
  }, [])

  const handleComplete = async (id: string) => {
    await completeSettlement(id)
    setSettlements(settlements.filter(s => s.id !== id))
  }

  return (
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
          <TableRow key={settlement.id}>
            <TableCell>{settlement.name}</TableCell>
            <TableCell>{settlement.amount}원</TableCell>
            <TableCell>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">상세 보기</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{settlement.name}의 정산 상세</DialogTitle>
                  </DialogHeader>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>받는 사람</TableHead>
                        <TableHead>금액</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {settlement.details.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell>{detail.recipient}</TableCell>
                          <TableCell>{detail.amount}원</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </DialogContent>
              </Dialog>
            </TableCell>
            <TableCell>
              <Button onClick={() => handleComplete(settlement.id)}>정산 완료</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

