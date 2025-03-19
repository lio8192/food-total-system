'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteMember } from './actions'

interface Member {
  id: string
  name: string
}

export function MemberList() {
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    // 실제 구현에서는 서버로부터 인원 목록을 가져옵니다.
    setMembers([
      { id: '1', name: '김철수' },
      { id: '2', name: '이영희' },
    ])
  }, [])

  const handleDelete = async (id: string) => {
    await deleteMember(id)
    setMembers(members.filter(m => m.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>이름</TableHead>
          <TableHead>작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {members.map((member) => (
          <TableRow key={member.id}>
            <TableCell>{member.id}</TableCell>
            <TableCell>{member.name}</TableCell>
            <TableCell>
              <Button variant="destructive" onClick={() => handleDelete(member.id)}>삭제</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

