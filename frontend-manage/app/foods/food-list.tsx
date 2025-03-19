'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteFood, updateFood } from './actions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Food {
  id: string
  item: string
  price: number
  person: string
  img: string
}

interface Member {
  id: string
  name: string
}

export function FoodList() {
  const [foods, setFoods] = useState<Food[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/foods`)
        const data = await response.json()
        // 데이터가 배열인지 확인하고 설정
        setFoods(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch foods:', error)
        setFoods([])
      }
    }

    const fetchMembers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
        const data = await response.json()
        // 데이터가 배열인지 확인하고 설정
        setMembers(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch members:', error)
        setMembers([])
      }
    }

    fetchFoods()
    fetchMembers()
  }, [])

  const handleEdit = (id: string) => {
    setEditingId(id)
  }

  const handleSave = async (id: string) => {
    const food = foods.find(f => f.id === id)
    if (food) {
      await updateFood({
        id: food.id,
        name: food.item,
        price: food.price,
        responsible: food.person,
        imageUrl: food.img
      })
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    await deleteFood(id)
    setFoods(foods.filter(f => f.id !== id))
  }

  const handleChange = (id: string, field: keyof Food, value: string) => {
    setFoods(foods.map(f =>
      f.id === id ? { ...f, [field]: field === 'price' ? parseInt(value) : value } : f
    ))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
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
              {editingId === food.id ? (
                <Input
                  value={food.item}
                  onChange={(e) => handleChange(food.id, 'item', e.target.value)}
                />
              ) : (
                food.item
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
                  value={food.person}
                  onValueChange={(value) => handleChange(food.id, 'person', value)}
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
                members.find(m => m.id === food.person)?.name || food.person
              )}
            </TableCell>
            <TableCell>
              {editingId === food.id ? (
                <Button onClick={() => handleSave(food.id)}>저장</Button>
              ) : (
                <Button onClick={() => handleEdit(food.id)}>수정</Button>
              )}
              <Button variant="destructive" className="ml-2" onClick={() => handleDelete(food.id)}>삭제</Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

