POST /api/users: 새로운 사용자 추가
GET /api/users: 모든 사용자 조회
DELETE /api/users/{id}: 사용자 삭제

POST /api/foods: 새로운 음식 항목 추가
GET /api/foods: 모든 음식 항목 조회
PUT /api/foods/{id}: 음식 항목 수정 (item, price, person만 수정 가능)
DELETE /api/foods/{id}: 음식 항목 삭제

POST /api/calculates: 새로운 주문 추가
GET /api/calculates: 모든 주문 조회
DELETE /api/calculates/{id}: 주문 삭제
POST /api/calculates/{personId}/complete: 특정 사용자의 모든 주문 정산 완료 처리
GET /api/calculates/{personId}/summary: 특정 사용자의 정산 요약 정보 조회