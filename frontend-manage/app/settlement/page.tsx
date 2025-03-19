import { SettlementList } from './settlement-list'

export default function SettlementPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">정산</h2>
      <SettlementList />
    </div>
  )
}

