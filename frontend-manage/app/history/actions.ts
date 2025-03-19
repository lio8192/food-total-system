'use server'

import { revalidatePath } from 'next/cache'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function cancelPurchase(id: number) {
  try {
    const response = await fetch(`${API_URL}/calculates/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('구매 취소에 실패했습니다');
    }

    revalidatePath('/history');
    return true;
  } catch (error) {
    console.error('구매 취소 중 오류 발생:', error);
    throw error;
  }
}

