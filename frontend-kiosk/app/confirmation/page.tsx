'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function Confirmation() {
  const [countdown, setCountdown] = useState(3)
  const router = useRouter()

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCount) => prevCount - 1)
    }, 1000)

    const redirect = setTimeout(() => {
      router.push('/')
    }, 3000)

    return () => {
      clearInterval(timer)
      clearTimeout(redirect)
    }
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">주문이 완료되었습니다</h1>
      <p className="text-2xl mb-8">주문 내역이 저장되었습니다.</p>
      <p className="text-xl mb-4">
        {countdown}초 뒤에 자동으로 메인페이지로 돌아갑니다
      </p>
      <Button
        className="w-40 h-20 text-xl"
        onClick={() => router.push('/')}
      >
        지금 돌아가기
      </Button>
    </div>
  )
}

