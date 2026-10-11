# 🖼️ 명화 감상 노트 / Art Appreciation Notes (React + Supabase SPA)

그림을 보고 느낀 점(작품, 작가, 연도, 별점, 감상)을 기록하는 SPA입니다.
등록 / 조회 / 수정 / 삭제(CRUD)를 지원하고, 페이지가 바뀔 때 화면이 "스르륵" 전환됩니다.

A single-page app for recording impressions of artworks (title, artist, year, rating, notes).
It supports full CRUD (Create / Read / Update / Delete), with smooth transitions between pages.

- 배포 URL / Live demo: https://reactsupabase.vercel.app
- GitHub: https://github.com/KANGSIK-SEO/reactsupabase

## 기술 스택 / Tech Stack

| 구분 / Area | 사용 기술 / Technology |
|---|---|
| UI | React 19 |
| 빌드 도구 / Build tool | Vite |
| 라우팅 / Routing | React Router 7 |
| 백엔드(DB) / Backend (DB) | Supabase (PostgreSQL) |
| 배포 / Hosting | Vercel |

## 실행 방법 / Getting Started

```bash
npm install            # 1. 라이브러리 설치 / Install dependencies
cp .env.example .env   # 2. 환경변수 파일 만들기 / Create env file (Windows: copy .env.example .env)
#   → .env 안에 Supabase URL / anon key 붙여넣기 / Paste your Supabase URL and anon key into .env
npm run dev            # 3. 개발 서버 실행 / Start dev server → http://localhost:5173
```

> `.env`를 비워두면 **데모 모드**로 동작합니다 (데이터가 브라우저에만 저장됨). Supabase 없이도 화면을 확인할 수 있습니다.
>
> If `.env` is left empty, the app runs in **demo mode** (data is stored only in your browser), so you can try it without Supabase.

### Supabase 준비 (한 번만) / Supabase Setup (one time)
1. https://supabase.com 에서 새 프로젝트 생성 / Create a new project
2. 왼쪽 메뉴 **SQL Editor** → `supabase/schema.sql` 내용 전체를 붙여넣고 **Run** / Paste all of `supabase/schema.sql` into the **SQL Editor** and click **Run**
3. **Project Settings → API** 에서 `Project URL`, `anon public` 키를 복사해 `.env`에 입력 / Copy the `Project URL` and `anon public` key into `.env`

### 배포 (Vercel) / Deployment (Vercel)
1. https://vercel.com 에서 GitHub 저장소 Import / Import this GitHub repository
2. **Environment Variables** 에 `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 추가 / Add both variables under **Environment Variables**
3. Deploy → 나온 주소를 위 "배포 URL"에 적기 / Put the resulting URL in "Live demo" above
   (`vercel.json`이 있어서 `/notes/3` 같은 주소로 바로 들어가도 404가 나지 않습니다 / `vercel.json` rewrites all paths to `index.html`, so deep links like `/notes/3` do not 404)

## 페이지 라우트 (7개) / Routes (7)

| 주소 / Path | 페이지 / Page | 하는 일 / Purpose |
|---|---|---|
| `/` | HomePage | 소개 + 최근 감상 3개 / Intro + 3 latest notes |
| `/notes` | NotesPage | 전체 목록 + 검색 / All notes + search |
| `/notes/new` | NewNotePage | 새 노트 등록 / Create |
| `/notes/:id` | NoteDetailPage | 상세 보기 + 삭제 / Read + Delete |
| `/notes/:id/edit` | EditNotePage | 수정 / Update |
| `/about` | AboutPage | 서비스/기술 소개 / About the service and stack |
| `*` | NotFoundPage | 없는 주소 → 404 / Unknown path → 404 |

## 폴더 구조 / Project Structure

```
src/
├─ api/          데이터 읽고 쓰는 코드 / Data access (Supabase / demo mode)
├─ hooks/        커스텀 훅 / Custom hooks (useNotes, useNote, useDocumentTitle)
├─ components/   재사용 컴포넌트 14개 / 14 reusable components
├─ pages/        라우트별 페이지 7개 / 7 route pages
├─ App.jsx       주소 → 페이지 연결 / Maps paths to pages
└─ main.jsx      시작점 / Entry point
supabase/schema.sql   테이블 생성 SQL / Table creation SQL
```

### 재사용 컴포넌트 (14개) / Reusable Components (14)
`Layout`, `NavBar`, `DemoBanner`, `Button`, `LoadingState`, `ErrorState`, `EmptyState`,
`AsyncBoundary`, `StarRating`, `SearchBar`, `NoteCard`, `NoteList`, `FormField`, `NoteForm`

### 커스텀 훅 (3개) / Custom Hooks (3)
- `useNotes()` → 목록 + `loading` / `error` / `reload` / List of notes with loading, error and reload
- `useNote(id)` → 노트 한 개 (id가 바뀌면 다시 요청) / One note, refetched when `id` changes
- `useDocumentTitle(title)` → 브라우저 탭 제목 변경 / Sets the browser tab title

---

## 설계 설명 (평가 질문 대비) / Design Notes

### 1. 컴포넌트를 어떤 기준으로 쪼갰나 / How components were split
- **여러 곳에서 반복되는 것** → 공통 컴포넌트: `Button`, `LoadingState`, `ErrorState`, `EmptyState`
  *Anything repeated across screens became a shared component.*
- **한 가지 일만 하는 단위**: `NoteCard`(노트 1개 보여주기) → `NoteList`(여러 개 나열)
  *One job per component: `NoteCard` shows one note, `NoteList` lays out many.*
- **등록과 수정이 같은 모양** → `NoteForm` 하나를 두 페이지가 같이 씀. 다른 점(저장 방법)만 `onSubmit` props로 받음
  *Create and Edit share one `NoteForm`; only the save logic differs, passed in via the `onSubmit` prop.*
- **페이지(pages)** 는 "데이터 가져오기 + 조립"만, **컴포넌트(components)** 는 "보여주기"만
  *Pages fetch data and assemble; components only render.*

### 2. props vs state, 상태를 어디에 뒀나 / props vs state, and where state lives
- **state** = 컴포넌트가 스스로 기억하고 바꾸는 값 (바뀌면 화면이 다시 그려짐)
  *Values a component owns and changes; changing them triggers a re-render.*
- **props** = 부모가 자식에게 넘겨주는 값 (자식은 읽기만)
  *Values passed from parent to child; read-only for the child.*

| 상태 / State | 위치 / Location | 이유 / Reason |
|---|---|---|
| 노트 목록 / 로딩 / 에러 (notes, loading, error) | `useNotes` 훅 (페이지에서 호출) | 그 페이지에서만 필요 / Needed only by that page |
| 검색어 `query` | `NotesPage` | `SearchBar`(입력)와 `NoteList`(결과) **둘 다** 필요 → 공통 부모로 끌어올림 / Both `SearchBar` and `NoteList` need it, so it is lifted to their common parent |
| 폼 입력값 / 에러 / 제출 중 (values, errors, submitting) | `NoteForm` 안 / inside `NoteForm` | 폼 밖에서는 필요 없음 / Not needed outside the form |

- **하향 흐름 / Data down**: `NotesPage` → `SearchBar`에 `value={query}` 전달 / passes `value={query}` to `SearchBar`
- **상향 흐름 / Events up**: `SearchBar`가 `onChange(글자)`를 호출 → 부모의 `setQuery` 실행 / `SearchBar` calls `onChange(text)`, which runs the parent's `setQuery`

### 3. useEffect는 언제 도나 / When useEffect runs
- `useNotes`: 의존성 `[load]`(바뀌지 않는 함수) → **페이지가 처음 나타날 때 1번** 데이터 요청
  *Depends on a stable `load`, so it fetches **once**, when the page first mounts.*
- `useNote(id)`: `load`가 `[id]`에 의존 → **주소의 id가 바뀔 때마다** 다시 요청
  *`load` depends on `[id]`, so it refetches **whenever the URL id changes**.*
- 즉 useEffect = "화면이 그려진 **뒤에** 바깥 세계(DB)와 연결하는 자리"
  *In short, useEffect is where the component syncs with the outside world (the DB) **after** rendering.*

### 4. 로딩 / 성공 / 실패 / 빈 상태 / Loading, success, error and empty states
모든 화면이 `AsyncBoundary` 하나로 같은 순서를 따릅니다.
*Every screen goes through one `AsyncBoundary` in the same order:*
```
loading            → <LoadingState/>   스피너 / spinner
error              → <ErrorState/>     메시지 + 다시 시도 / message + retry button
비어있음 / empty     → <EmptyState/>     안내 + 행동 버튼 / hint + action button
그 외 / otherwise   → 실제 화면 / the real content
```
폼에서는 `submitting` 상태로 버튼을 "저장 중..."으로 바꾸고 비활성화해서 중복 제출을 막습니다.
*In forms, the `submitting` state switches the button to "저장 중..." (Saving...) and disables it to prevent double submits.*

### 5. "노트 등록" 기능 하나의 전체 흐름 / End-to-end flow of "Create a note"
1. **라우팅 / Routing**: `/notes/new` 주소 → `App.jsx`가 `NewNotePage` 표시 / `App.jsx` renders `NewNotePage`
2. **컴포넌트 / Component**: `NewNotePage`가 `NoteForm`을 그림 / `NewNotePage` renders `NoteForm`
3. **이벤트 / Event**: 사용자가 입력 → `onChange` → `setValues` (state 변경) / typing calls `onChange` → `setValues` (state update)
4. **렌더링 / Rendering**: state가 바뀌어 입력칸 다시 그림. 제출 시 `validate()` 실패면 `errors` state → 빨간 에러 문구 표시 / The input re-renders; on submit, if `validate()` fails, the `errors` state shows red messages
5. **비동기 / Async**: 통과하면 `submitting=true`(버튼 비활성) → `notesApi.create()`로 Supabase에 저장 (HTTP **POST**) / If valid, `submitting=true` disables the button and `notesApi.create()` saves to Supabase (HTTP **POST**)
6. **라우팅 / Routing**: 성공 → `navigate('/notes/새id')` → 상세 페이지에서 `useNote`가 다시 데이터를 가져와 표시 / On success, `navigate('/notes/<newId>')`; the detail page's `useNote` fetches and shows the note
