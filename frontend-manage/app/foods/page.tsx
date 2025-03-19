import { PageHeader } from '../components/page-header'
import { FoodList } from './food-list'
import { AddFoodForm } from './add-food-form'

export default function FoodsPage() {
  return (
    <div>
      <PageHeader 
        title="음식 관리" 
        description="음식 항목을 추가, 수정, 삭제할 수 있습니다."
      />
      <div className="mt-8 space-y-8">
        <AddFoodForm />
        <FoodList />
      </div>
    </div>
  )
}

