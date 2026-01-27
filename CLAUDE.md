# Claude Code 프로젝트 가이드

## 개발 서버

### 포트 관리
- 개발 서버는 **포트 3000**을 사용합니다.
- 서버 실행 전 기존 포트 3000 프로세스가 있으면 **종료 후 실행**합니다.
- 포트가 사용 중일 때 다른 포트로 우회하지 말고, 기존 프로세스를 종료하세요.

```bash
# 포트 3000 사용 프로세스 확인
netstat -ano | grep ":3000"

# 프로세스 종료 (Windows)
taskkill //F //PID <PID번호>

# 서버 실행
cd E:/Claude/blog && npm run dev
```

### 서버 실행 순서
1. 포트 3000 사용 중인지 확인
2. 사용 중이면 해당 프로세스 종료
3. `npm run dev` 실행
4. http://localhost:3000 에서 확인

## 디자인 작업

**중요: 디자인 관련 작업 시 반드시 `frontend-design` 플러그인(스킬)을 사용할 것.**

- UI 컴포넌트 수정/추가
- 레이아웃 변경
- 스타일링 작업
- 새로운 페이지 디자인

## 기술 스택
- Next.js 15 (App Router)
- Tailwind CSS
- Supabase (PostgreSQL + Auth)
- TypeScript

## 환경 변수
`.env.local` 파일에 Supabase 키 설정 필요:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
