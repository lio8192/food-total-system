'use server'

import { revalidatePath } from 'next/cache'

async function uploadImage(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/images/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('Failed to upload image')
  }

  const data = await response.json()
  return `/images/${data.filename}` // 이미지 URL 반환
}

export async function addFood(food: { name: string; price: number; responsible: string; image: File }) {
  try {
    // 1. 먼저 이미지 업로드
    const imageUrl = await uploadImage(food.image)

    // 2. 음식 데이터 추가
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/foods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        item: food.name,
        price: food.price,
        person: food.responsible,
        img: imageUrl,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to add food')
    }

    revalidatePath('/foods')
  } catch (error) {
    console.error('Error adding food:', error)
    throw error
  }
}

export async function updateFood(food: { id: string; name: string; price: number; responsible: string; imageUrl: string }) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/foods/${food.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      item: food.name,
      price: food.price,
      person: food.responsible,
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to update food')
  }

  revalidatePath('/foods')
}

export async function deleteFood(id: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/foods/${id}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Failed to delete food')
  }

  revalidatePath('/foods')
}

