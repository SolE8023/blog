---
title: "블로그에 오신 것을 환영합니다"
date: "2026-01-23"
description: "Next.js로 만든 개인 블로그의 첫 번째 글입니다. 마크다운의 다양한 기능을 소개합니다."
tags: ["블로그", "Next.js", "마크다운"]
---

# 블로그에 오신 것을 환영합니다

안녕하세요! 이 블로그는 **Next.js**와 **Tailwind CSS**로 제작되었습니다.

## 마크다운 기능 소개

이 블로그는 다양한 마크다운 문법을 지원합니다.

### 텍스트 스타일링

- **굵은 글씨**
- *기울임 글씨*
- ~~취소선~~
- `인라인 코드`

### 링크와 이미지

[Next.js 공식 문서](https://nextjs.org/docs)를 참고하세요.

### 인용문

> 좋은 코드는 최고의 문서입니다.
> - Steve McConnell

### 코드 블록

JavaScript 코드 예시:

```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
  return `Welcome to my blog`;
}

greet('World');
```

Python 코드 예시:

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# 피보나치 수열 출력
for i in range(10):
    print(fibonacci(i), end=' ')
```

### 목록

#### 순서 없는 목록
- 항목 1
- 항목 2
  - 중첩 항목 A
  - 중첩 항목 B
- 항목 3

#### 순서 있는 목록
1. 첫 번째
2. 두 번째
3. 세 번째

### 표

| 기능 | 지원 여부 | 비고 |
|------|:--------:|------|
| 다크모드 | O | 토글 버튼 제공 |
| 마크다운 | O | GFM 지원 |
| 코드 하이라이팅 | O | highlight.js 사용 |
| 댓글 | O | 로컬 스토리지 기반 |
| 검색 | O | 제목/설명/태그 검색 |

### 체크박스

- [x] 블로그 기본 구조 완성
- [x] 다크모드 구현
- [x] 마크다운 렌더링
- [ ] 추가 기능 개발

---

## 마무리

이제 `posts` 폴더에 마크다운 파일을 추가하여 새 글을 작성할 수 있습니다.

글 작성 시 frontmatter에 다음 정보를 포함해주세요:

```yaml
---
title: "글 제목"
date: "2026-01-23"
description: "글 설명"
tags: ["태그1", "태그2"]
---
```

즐거운 블로깅 되세요!
