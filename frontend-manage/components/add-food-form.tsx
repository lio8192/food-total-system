'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { addFood } from './actions'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function AddFoodForm() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [responsible, setResponsible] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [members, setMembers] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => setMembers(data))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (name && price && responsible && image) {
      await addFood({ name, price: parseInt(price), responsible, image })
      setName('')
      setPrice('')
      setResponsible('')
      setImage(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <Label htmlFor="name">음식 이름</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="price">가격</Label>
        <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="responsible">담당자</Label>
        <Select onValueChange={(value) => setResponsible(value)} value={responsible}>
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
      </div>
      <div>
        <Label htmlFor="image">이미지</Label>
        <Input id="image" type="file" onChange={(e) => setImage(e.target.files?.[0] || null)} required />
      </div>
      <Button type="submit">음식 추가</Button>
    </form>
  )
}

