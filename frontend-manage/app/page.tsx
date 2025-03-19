export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">랩실 음식 정산 관리 포털에 오신 것을 환영합니다</h2>
      <p className="mb-4">이 포털에서는 다음과 같은 기능을 제공합니다:</p>
      <ul className="list-disc list-inside mb-4">
        <li>음식 관리: 음식 항목의 추가, 수정, 삭제</li>
        <li>구매 히스토리: 구매된 음식의 기록 확인</li>
        <li>인원 관리: 랩실 인원의 추가 및 삭제</li>
        <li>정산 시스템: 인원별 정산 금액 확인 및 처리</li>
      </ul>
      <p>위 메뉴를 통해 각 기능을 이용할 수 있습니다.</p>
    </div>
  )
}

