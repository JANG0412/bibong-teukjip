## 비봉 특집

지인들과의 모임 기록을 보관하는 웹 앱입니다.

### 주요 기능

- **기록하기**: 모임 날짜, 제목, 참석자, 활동 내용, 사진 업로드
- **조회(메인 피드)**: 최신순으로 기록 표시
- **검색**: 제목 또는 참석자로 검색

### 실행 방법 (PostgreSQL)

1) `.env.local` 생성

`.env.local.example`을 복사해서 `.env.local`로 만들고 `DATABASE_URL`을 채워주세요.

2) 실행

```bash
npm run dev
```

앱이 첫 실행 시 `records` 테이블을 자동으로 생성합니다.

### 배포 (Vercel + Neon Postgres)

#### 1) Neon에서 `DATABASE_URL` 복사

Neon 프로젝트의 Connection details에서 `postgresql://...` 형태의 연결 문자열을 복사합니다.

#### 2) Vercel 환경변수 설정

Vercel 프로젝트 Settings → Environment Variables에 아래를 추가합니다.

- **`DATABASE_URL`**: Neon에서 복사한 연결 문자열
- **`DATABASE_SSL`**: `true`
- **`BLOB_READ_WRITE_TOKEN`**: Vercel Storage(Blob)에서 발급한 토큰 (사진 업로드 영구 저장용)

> `BLOB_READ_WRITE_TOKEN`이 없으면 사진은 로컬 개발 모드에서만 `public/uploads`에 저장됩니다.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
