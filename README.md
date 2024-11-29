<p align="center">
  <img src="front-end/image/logo_blue.png" alt="중거쇼 로고" width="400"/>
</p>

<div align="center" style="display: flex; justify-content: center; align-items: center; gap: 10px; margin-top: 10px;">
  <strong style="font-size: 18px;">동국대학교 구성원을 위한 신뢰도 높은 중고 거래 플랫폼</strong>
  <img src="front-end/image/image.png" alt="신뢰도 이미지" width="35" style="vertical-align:middle; margin-top: 3px;"/>
</div>

---

## 📌 프로젝트 소개 📌

**중거쇼**는 동국대학교 구성원을 위한 전용 중고 거래 플랫폼입니다.  
기존 직거래의 비효율성을 개선하고, 학내 구성원 간 안전하고 신뢰할 수 있는 거래 환경을 제공합니다.

- **프로젝트 주요 목표:**
  - 학번 기반 회원가입으로 높은 신뢰 기반 투명한 거래 환경
  - 기존 직거래의 시간적/공간적 제약 해결
  - 배송 기반 거래 환경 제공

## 📌 주요 기능

- **회원가입**: 회원 테이블 속성 사용해 사용자의 상세정보 입력받아 계정 생성. 학번으로 가입한 회원ID가 기본키.
- **로그인**: 회원 테이블의 회원ID와 비밀번호로 로그인 인증 성공 시 거래 내역, 장바구니 등 개인화된 서비스 제공.
- **중고 거래 물품 관리**: 상품 테이블에 상품 정보 저장. 수정과 삭제는 판매자ID 기반으로 권한 부여. 상품과 회원 테이블 조인하여 상품정보와 판매자 정보 같이 조회 가능.
- **장바구니 기능**: 장바구니 테이블에 회원ID와 상품ID가 저장되어 동일 상품 중복 삽입 방지.
- **거래**: 주문과 주문 상세 테이블 연계해 주문 데이터 체계적 관리. 거래 완료시, "거래완료"로 거래 상태 업데이트.
- **거래후기 작성**: 상품 테이블과 연계해 구매자만 거래 완료된 상품에 대해 한 번만 평점 및 후기 작성 가능.
- **마이페이지**: 회원, 상품, 주문, 주문상세, 장바구니 테이블 연계해 회원 정보, 등록 상품, 구매 내역, 장바구니 목록 조회 가능.

## 💻 기술 스택

- **Backend**: Node.js
- **Frontend**: React.js
- **Database**: MySQL