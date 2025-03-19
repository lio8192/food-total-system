import { PurchaseHistory } from './purchase-history'
import { PageHeader } from '../components/page-header'

export default function HistoryPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader 
        title="구매 히스토리" 
        description="구매 기록을 확인하고 관리할 수 있습니다. 취소된 구매는 회색으로 표시됩니다."
      />
      <PurchaseHistory />
    </div>
  )
}

