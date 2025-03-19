'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { getMembers, createMember, deleteMember, Member } from './actions'
import { toast } from "sonner"

export function MemberList() {
  const [members, setMembers] = useState<Member[]>([])
  const [newMemberName, setNewMemberName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const fetchMembers = async () => {
    try {
      const data = await getMembers()
      setMembers(data)
    } catch (error) {
      toast.error('멤버 목록을 불러오는데 실패했습니다.')
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberName.trim()) return

    setIsLoading(true)
    try {
      const newMember = await createMember(newMemberName)
      setMembers([...members, newMember])
      setNewMemberName('')
      toast.success('멤버가 추가되었습니다.')
    } catch (error) {
      toast.error('멤버 추가에 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMember(id)
      // 에러가 발생하지 않았다면 성공으로 간주하고 UI 업데이트
      setMembers(members.filter(m => m.id !== id))
      toast.success('멤버가 삭제되었습니다.')
    } catch (error) {
      console.error('멤버 삭제 중 오류 발생:', error)
      
      // 이미 삭제되었을 가능성이 있는 경우 UI만 업데이트
      if (error instanceof Error && error.message.includes('already deleted')) {
        setMembers(members.filter(m => m.id !== id))
        toast.info('멤버가 이미 삭제되었습니다.')
      } else {
        toast.error('멤버 삭제에 실패했습니다.')
      }
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleAdd} className="flex gap-2">
        <Input
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          placeholder="새 멤버 이름"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          추가
        </Button>
      </form>

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
                <Button 
                  variant="destructive" 
                  onClick={() => handleDelete(member.id)}
                >
                  삭제
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

