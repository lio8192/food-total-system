import { NextResponse } from 'next/server';

// 이 부분은 실제 데이터베이스에서 가져오는 로직으로 대체되어야 합니다.
const members = [
  { id: '1', name: '김철수' },
  { id: '2', name: '이영희' },
  { id: '3', name: '박지성' },
];

export async function GET() {
  return NextResponse.json(members);
}

