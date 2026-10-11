# 🖼️ 명화 감상 노트 (React + Supabase SPA)

그림을 보고 느낀 점(작품, 작가, 연도, 별점, 감상)을 기록하는 SPA입니다.
등록 / 조회 / 수정 / 삭제(CRUD)를 지원하고, 페이지가 바뀔 때 화면이 "스르륵" 전환됩니다.

- 배포 URL: (배포 후 여기에 적기)
- GitHub: https://github.com/KANGSIK-SEO/reactsupabase

## 기술 스택

| 구분 | 사용 기술 |
|---|---|
| UI | React 19 |
| 빌드 도구 | Vite |
| 라우팅 | React Router 7 |
| 백엔드(DB) | Supabase (PostgreSQL) |
| 배포 | Vercel 또는 Netlify |

## 실행 방법

```bash
npm install        # 1. 필요한 라이브러리 설치
cp .env.example .env   # 2. 환경변수 파일 만들기 (Windows: copy .env.example .env)
#   → .env 안에 Supabase URL / anon key 붙여넣기
npm run dev        # 3. 개발 서버 실행 → http://localhost:5173
```

> `.env`를 비워두면 **데모 모드**로 동작합니다 (데이터가 브라우저에만 저장됨). Supabase 없이도 화면을 확인할 수 있습니다.

### Supabase 준비 (한 번만)
1. https://supabase.com 에서 새 프로젝트 생성
2. 왼쪽 메뉴 **SQL Editor** → `supabase/schema.sql` 내용 전체를 붙여넣고 **Run**
3. **Project Settings → API** 에서 `Project URL`, `anon public` 키를 복사해 `.env`에 입력

### 배포 (Vercel)
1. https://vercel.com 에서 GitHub 저장소 Import
2. **Environment Variables** 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 추가
3. Deploy → 나온 주소를 위 "배포 URL"에 적기
   (`vercel.json`이 있어서 `/notes/3` 같은 주소로 바로 들어가도 404가 나지 않습니다)

## 페이지 라우트 (7개)

| 주소 | 페이지 | 하는 일 |
|---|---|---|
| `/` | HomePage | 소개 + 최근 감상 3개 |
| `/notes` | NotesPage | 전체 목록 + 검색 |
| `/notes/new` | NewNotePage | 새 노트 등록 (Create) |
| `/notes/:id` | NoteDetailPage | 상세 보기 (Read) + 삭제 (Delete) |
| `/notes/:id/edit` | EditNotePage | 수정 (Update) |
| `/about` | AboutPage | 서비스/기술 소개 |
| `*` | NotFoundPage | 없는 주소 → 404 |

## 폴더 구조

```
src/
├─ api/          데이터 읽고 쓰는 코드 (Supabase / 데모 모드)
├─ hooks/        커스텀 훅 (useNotes, useNote, useDocumentTitle)
├─ components/   재사용 컴포넌트 14개
├─ pages/        라우트별 페이지 7개
├─ App.jsx       주소 → 페이지 연결
└─ main.jsx      시작점
supabase/schema.sql   테이블 생성 SQL
```

### 재사용 컴포넌트 (14개)
`Layout`, `NavBar`, `DemoBanner`, `Button`, `LoadingState`, `ErrorState`, `EmptyState`,
`AsyncBoundary`, `StarRating`, `SearchBar`, `NoteCard`, `NoteList`, `FormField`, `NoteForm`

### 커스텀 훅 (3개)
- `useNotes()` → 목록 + `loading` / `error` / `reload`
- `useNote(id)` → 노트 한 개 (id가 바뀌면 다시 요청)
- `useDocumentTitle(title)` → 브라우저 탭 제목 변경

---

## 설계 설명 (평가 질문 대비)

### 1. 컴포넌트를 어떤 기준으로 쪼갰나
- **여러 곳에서 반복되는 것** → 공통 컴포넌트: `Button`, `LoadingState`, `ErrorState`, `EmptyState`
- **한 가지 일만 하는 단위**: `NoteCard`(노트 1개 보여주기) → `NoteList`(여러 개 나열)
- **등록과 수정이 같은 모양** → `NoteForm` 하나를 두 페이지가 같이 씀. 다른 점(저장 방법)만 `onSubmit` props로 받음
- **페이지(pages)** 는 "데이터 가져오기 + 조립"만, **컴포넌트(components)** 는 "보여주기"만

### 2. props vs state, 상태를 어디에 뒀나
- **state** = 컴포넌트가 스스로 기억하고 바꾸는 값 (바뀌면 화면이 다시 그려짐)
- **props** = 부모가 자식에게 넘겨주는 값 (자식은 읽기만)

| 상태 | 위치 | 이유 |
|---|---|---|
| 노트 목록 / 로딩 / 에러 | `useNotes` 훅 (페이지에서 호출) | 그 페이지에서만 필요 |
| 검색어 `query` | `NotesPage` | `SearchBar`(입력)와 `NoteList`(결과) **둘 다** 필요 → 공통 부모로 끌어올림 |
| 폼 입력값 / 에러 / 제출 중 | `NoteForm` 안 | 폼 밖에서는 필요 없음 |

- **하향 흐름**: `NotesPage` → `SearchBar`에 `value={query}` 전달
- **상향 흐름**: `SearchBar`가 `onChange(글자)`를 호출 → 부모의 `setQuery` 실행

### 3. useEffect는 언제 도나
- `useNotes`: 의존성 `[load]`(바뀌지 않는 함수) → **페이지가 처음 나타날 때 1번** 데이터 요청
- `useNote(id)`: `load`가 `[id]`에 의존 → **주소의 id가 바뀔 때마다** 다시 요청
- 즉 useEffect = "화면이 그려진 **뒤에** 바깥 세계(DB)와 연결하는 자리"

### 4. 로딩 / 성공 / 실패 / 빈 상태
모든 화면이 `AsyncBoundary` 하나로 같은 순서를 따릅니다.
```
loading → <LoadingState/>   (스피너)
error   → <ErrorState/>     (메시지 + 다시 시도 버튼)
비어있음 → <EmptyState/>     (안내 + 행동 버튼)
그 외   → 실제 화면
```
폼에서는 `submitting` 상태로 버튼을 "저장 중..."으로 바꾸고 비활성화해서 중복 제출을 막습니다.

### 5. "노트 등록" 기능 하나의 전체 흐름
1. **라우팅**: `/notes/new` 주소 → `App.jsx`가 `NewNotePage` 표시
2. **컴포넌트**: `NewNotePage`가 `NoteForm`을 그림
3. **이벤트**: 사용자가 입력 → `onChange` → `setValues` (state 변경)
4. **렌더링**: state가 바뀌어 입력칸 다시 그림. 제출 시 `validate()` 실패면 `errors` state → 빨간 에러 문구 표시
5. **비동기**: 통과하면 `submitting=true`(버튼 비활성) → `notesApi.create()`로 Supabase에 저장
6. **라우팅**: 성공 → `navigate('/notes/새id')` → 상세 페이지에서 `useNote`가 다시 데이터를 가져와 표시
