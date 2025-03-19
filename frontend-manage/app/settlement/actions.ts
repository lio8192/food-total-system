'use server'

import { revalidatePath } from 'next/cache'

export async function completeSettlement(id: string) {
  // 여기에서 실제 데이터베이스에 정산 완료를 기록하는 로직을 구현합니다.
  console.log('Completing settlement:', id)
  revalidatePath('/settlement')
}

