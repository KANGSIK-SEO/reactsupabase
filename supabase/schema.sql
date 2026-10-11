-- Supabase 대시보드 → SQL Editor 에 통째로 붙여넣고 Run 하세요.

create table if not exists public.notes (
  id          bigint generated always as identity primary key,
  title       text        not null,           -- 작품 제목
  artist      text        not null,           -- 작가
  year        integer,                        -- 제작 연도 (선택)
  rating      integer     not null check (rating between 1 and 5),
  content     text        not null,           -- 감상 내용
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 과제용 공개 데모: 로그인 없이 누구나 읽고/쓰기 가능하도록 정책을 엽니다.
alter table public.notes enable row level security;

drop policy if exists "public read"   on public.notes;
drop policy if exists "public insert" on public.notes;
drop policy if exists "public update" on public.notes;
drop policy if exists "public delete" on public.notes;

create policy "public read"   on public.notes for select using (true);
create policy "public insert" on public.notes for insert with check (true);
create policy "public update" on public.notes for update using (true);
create policy "public delete" on public.notes for delete using (true);

-- 예시 데이터 (원하지 않으면 지워도 됩니다)
insert into public.notes (title, artist, year, rating, content) values
  ('별이 빛나는 밤', '빈센트 반 고흐', 1889, 5, '소용돌이치는 하늘이 마음속 불안과 설렘을 동시에 보여주는 것 같다.'),
  ('진주 귀걸이를 한 소녀', '요하네스 페르메이르', 1665, 4, '어두운 배경 속 눈빛과 귀걸이의 빛 한 점이 오래 남는다.');
