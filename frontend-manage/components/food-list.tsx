'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteFood, updateFood } from './actions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Food {
  id: string
  name: string
  price: number
  responsible: string
  imageUrl: string
}

export function FoodList() {
  const [foods, setFoods] = useState<Food[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [members, setMembers] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    // 실제 구현에서는 서버로부터 음식 목록을 가져옵니다.
    setFoods([
      { id: '1', name: '피자', price: 20000, responsible: '1', imageUrl: '/pizza.jpg' },
      { id: '2', name: '치킨', price: 18000, responsible: '2', imageUrl: '/chicken.jpg' },
    ])
  }, [])

  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
  }, [])

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = async (id: string) => {
    const food = foods.find(f => f.id === id)
    if (food) {
      await updateFood(food)
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteFood(id)
    setFoods(foods.filter(f => f.id !== id))
  }

  const handleChange = (id: string, field: keyof Food, value: string | string[]) => {
    setFoods(foods.map(f =>
      f.id === id ? { ...f, [field]: field === 'price' ? parseInt(value as string) : value } : f
    ))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>이미지</TableHead>
          <TableHead>이름</TableHead>
          <TableHead>가격</TableHead>
          <TableHead>담당자</TableHead>
          <TableHead>작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {foods.map((food) => (
          <TableRow key={food.id}>
            <TableCell>
              <img src={food.imageUrl} alt={food.name} className="w-16 h-16 object-cover" />
            </TableCell>
            <TableCell>
              {editingId === food.id ? (
                <Input
                  value={food.name}
                  onChange={(e) => handleChange(food.id, 'name', e.target.value)}
                />
              ) : (
                food.name
              )}
            </TableCell>
            <TableCell>
              {editingId === food.id ? (
                <Input
                  type="number"
                  value={food.price}
                  onChange={(e) => handleChange(food.id, 'price', e.target.value)}
                />
              ) : (
                `${food.price}원`
              )}
            </TableCell>
            <TableCell>
              {editingId === food.id ? (
                <Select
                  value={food.responsible}
                  onValueChange={(value) => handleChange(food.id, 'responsible', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="담당자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                members.find(m => m.id === food.responsible)?.name || food.responsible
              )}
            </TableCell>
            <TableCell>
              {editingId === food.id ? (
                <Button onClick={() => handleSave(food.id)}>저장</Button>
              ) : (
                <Button onClick={() => handleEdit(food.id)}>수정</Button>
              )}
              <Button variant="destructive" onClick={() => handleDelete(food.id)}>삭제</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

