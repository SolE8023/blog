---
title: "React 시작하기"
date: "2026-01-22"
description: "React의 기본 개념과 컴포넌트 작성 방법을 알아봅니다."
tags: ["React", "JavaScript", "프론트엔드"]
---

# React 시작하기

React는 Facebook에서 개발한 JavaScript 라이브러리입니다. 사용자 인터페이스를 구축하기 위한 선언적이고 효율적인 방법을 제공합니다.

## 왜 React인가?

React를 선택하는 이유는 다양합니다:

1. **컴포넌트 기반** - 재사용 가능한 UI 조각
2. **Virtual DOM** - 효율적인 렌더링
3. **단방향 데이터 흐름** - 예측 가능한 상태 관리
4. **거대한 생태계** - 풍부한 라이브러리와 도구

## 첫 번째 컴포넌트

간단한 React 컴포넌트를 만들어 봅시다:

```jsx
function Welcome({ name }) {
  return (
    <div className="welcome">
      <h1>안녕하세요, {name}님!</h1>
      <p>React 세계에 오신 것을 환영합니다.</p>
    </div>
  );
}

export default Welcome;
```

## Hooks 사용하기

React 16.8부터 도입된 Hooks를 사용하면 함수형 컴포넌트에서도 상태 관리가 가능합니다.

### useState

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>현재 카운트: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        증가
      </button>
    </div>
  );
}
```

### useEffect

```jsx
import { useState, useEffect } from 'react';

function DataFetcher() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/data');
      const result = await response.json();
      setData(result);
      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading) return <p>로딩 중...</p>;

  return <div>{JSON.stringify(data)}</div>;
}
```

## 다음 단계

React를 더 깊이 배우려면:

- [React 공식 문서](https://react.dev)
- Next.js로 서버 사이드 렌더링 배우기
- 상태 관리 라이브러리 (Redux, Zustand) 학습

React와 함께 즐거운 개발 되세요!
