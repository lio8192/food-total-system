'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from 'sonner'

interface Member {
  id: number;  // string에서 number로 변경
  name: string;
}

export function AddFoodForm() {
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [responsible, setResponsible] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [members, setMembers] = useState<Member[]>([])  // 타입 변경

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`)
      .then(res => res.json())
      .then(data => setMembers(data))
      .catch(() => toast.error('담당자 목록을 가져오는데 실패했습니다.'))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !price || !responsible || !image) return

    try {
      // 이미지 업로드
      const formData = new FormData()
      formData.append('file', image)

      const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/images/upload`, {
        method: 'POST',
        body: formData
      })

      if (!uploadResponse.ok) {
        throw new Error('이미지 업로드에 실패했습니다.')
      }

      // 응답이 JSON 형식이 아닐 경우 대비하여 text로 받아서 파싱 시도
      const responseText = await uploadResponse.text()
      let imageUrl: string
      try {
        const uploadResult = JSON.parse(responseText)
        imageUrl = uploadResult.imageUrl
      } catch (err) {
        imageUrl = responseText
      }

      // 음식 추가
      const foodResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/foods`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          item: name,
          price: parseInt(price),
          person: responsible,
          img: imageUrl
        })
      })

      if (!foodResponse.ok) {
        throw new Error('음식 추가에 실패했습니다.')
      }

      // 성공 시 폼 초기화 및 성공 토스트 표시
      setName('')
      setPrice('')
      setResponsible('')
      setImage(null)
      toast.success('음식이 추가되었습니다.')
      setTimeout(() => {
        window.location.reload()
      }, 200)
    } catch (error: any) {
      toast.error(error?.message || '알 수 없는 에러가 발생했습니다.')
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
              <SelectItem key={member.id} value={member.id.toString()}>  {/* toString() 추가 */}
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

