# Next.js Blog

Next.js 15와 Supabase로 구축한 개인 블로그입니다.

## 기술 스택

- **프론트엔드**: Next.js 15 (App Router)
- **스타일링**: Tailwind CSS
- **백엔드/DB**: Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **댓글**: Giscus (GitHub Discussions 기반)

## 주요 기능

- 다크모드 지원
- 게시물 검색
- 카테고리/태그 필터링
- 관리자 페이지 (게시물 CRUD)
- 마크다운 에디터
- 댓글 시스템 (Giscus)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Authentication > Users에서 관리자 계정 생성

### 3. 환경변수 설정

`.env.local.example`을 `.env.local`로 복사하고 값을 입력:

```bash
cp .env.local.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Giscus (선택사항)
NEXT_PUBLIC_GISCUS_REPO=username/repo
NEXT_PUBLIC_GISCUS_REPO_ID=your-repo-id
NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
NEXT_PUBLIC_GISCUS_CATEGORY_ID=your-category-id
```

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 홈 (게시물 목록)
│   ├── posts/[slug]/         # 게시물 상세
│   ├── categories/           # 카테고리별 목록
│   ├── tags/                 # 태그별 목록
│   ├── search/               # 검색
│   └── admin/                # 관리자 페이지
│       ├── login/            # 로그인
│       ├── posts/            # 게시물 관리
│       ├── categories/       # 카테고리 관리
│       └── tags/             # 태그 관리
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── PostCard.tsx
│   ├── ThemeToggle.tsx
│   ├── SearchBar.tsx
│   ├── Comments.tsx
│   ├── MarkdownRenderer.tsx
│   └── admin/
│       ├── AdminAuthProvider.tsx
│       ├── PostForm.tsx
│       └── ...
├── lib/
│   ├── supabase-browser.ts   # 클라이언트용 Supabase
│   ├── supabase-server.ts    # 서버용 Supabase
│   └── utils.ts
└── types/
    └── index.ts
```

## 배포

### Vercel 배포

1. GitHub에 푸시
2. [Vercel](https://vercel.com)에서 프로젝트 import
3. 환경변수 설정
4. 배포

## Giscus 댓글 설정

1. https://giscus.app 방문
2. GitHub 레포지토리 연결
3. Discussions 활성화
4. 설정 값을 환경변수에 추가

## 라이선스

MIT
