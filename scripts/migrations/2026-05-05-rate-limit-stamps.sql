-- 2026-05-05: rate-limit passport_stamps inserts to prevent spam
-- Run on Supabase via SQL Editor. Safe to re-run (uses CREATE OR REPLACE).

create or replace function public.passport_stamp_rate_limit()
returns trigger as $$
begin
  if (
    select count(*) from public.passport_stamps
    where user_id = new.user_id
      and recipe_slug = new.recipe_slug
      and cooked_at > now() - interval '24 hours'
  ) >= 5 then
    raise exception 'rate_limit_exceeded' using errcode = 'P0001';
  end if;

  if (
    select count(*) from public.passport_stamps
    where user_id = new.user_id
  ) >= 10000 then
    raise exception 'lifetime_cap_exceeded' using errcode = 'P0001';
  end if;

  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists passport_stamps_rate_limit_trg on public.passport_stamps;

create trigger passport_stamps_rate_limit_trg
  before insert on public.passport_stamps
  for each row execute function public.passport_stamp_rate_limit();
