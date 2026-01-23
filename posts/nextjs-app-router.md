---
title: "Next.js App Router 완벽 가이드"
date: "2026-01-21"
description: "Next.js 13에서 도입된 App Router의 주요 기능과 사용법을 알아봅니다."
tags: ["Next.js", "React", "프론트엔드"]
---

# Next.js App Router 완벽 가이드

Next.js 13부터 도입된 App Router는 React Server Components를 기반으로 한 새로운 라우팅 시스템입니다.

## 디렉토리 구조

App Router는 `app` 디렉토리를 사용합니다:

```
app/
├── layout.tsx      # 루트 레이아웃
├── page.tsx        # 홈페이지 (/)
├── about/
│   └── page.tsx    # /about
└── blog/
    ├── page.tsx    # /blog
    └── [slug]/
        └── page.tsx # /blog/:slug
```

## 주요 파일 규칙

| 파일명 | 용도 |
|--------|------|
| `page.tsx` | 라우트 UI |
| `layout.tsx` | 공유 레이아웃 |
| `loading.tsx` | 로딩 UI |
| `error.tsx` | 에러 UI |
| `not-found.tsx` | 404 UI |

## 서버 컴포넌트 vs 클라이언트 컴포넌트

### 서버 컴포넌트 (기본값)

```tsx
// app/posts/page.tsx
async function PostsPage() {
  // 서버에서 직접 데이터 fetching
  const posts = await fetch('https://api.example.com/posts');

  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  );
}
```

### 클라이언트 컴포넌트

```tsx
'use client';

import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(c => c + 1)}>
      Count: {count}
    </button>
  );
}
```

## 데이터 Fetching

App Router에서는 `fetch`를 확장하여 캐싱과 재검증을 지원합니다:

```tsx
// 캐싱된 데이터 (기본값)
const data = await fetch('https://api.example.com/data');

// 캐시 없이 항상 새로운 데이터
const freshData = await fetch('https://api.example.com/data', {
  cache: 'no-store'
});

// 60초마다 재검증
const revalidatedData = await fetch('https://api.example.com/data', {
  next: { revalidate: 60 }
});
```

## 메타데이터

SEO를 위한 메타데이터 설정:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '페이지 제목',
  description: '페이지 설명',
  openGraph: {
    title: 'OG 제목',
    description: 'OG 설명',
  },
};
```

## 결론

App Router는 더 나은 성능과 개발자 경험을 제공합니다. React의 최신 기능을 활용하여 모던 웹 애플리케이션을 구축해보세요!
