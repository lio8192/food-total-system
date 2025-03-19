import { MemberList } from './member-list'

export default function MembersPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">인원 관리</h2>
      <MemberList />
    </div>
  )
}

