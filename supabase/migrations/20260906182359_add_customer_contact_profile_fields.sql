alter table public.customer_private_profiles
  add column if not exists phone text,
  add column if not exists contact_address text;

alter table public.customer_private_profiles
  drop constraint if exists customer_private_profiles_phone_check;

alter table public.customer_private_profiles
  add constraint customer_private_profiles_phone_check
    check (phone is null or char_length(phone) between 5 and 30);

alter table public.customer_private_profiles
  drop constraint if exists customer_private_profiles_contact_address_check;

alter table public.customer_private_profiles
  add constraint customer_private_profiles_contact_address_check
    check (contact_address is null or char_length(contact_address) between 5 and 300);

create or replace function public.sync_customer_contact_profile_from_order()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_phone text;
  v_contact_address text;
begin
  if new.customer_id is null then
    return new;
  end if;

  v_phone := nullif(left(btrim(coalesce(new.recipient_phone, '')), 30), '');
  v_contact_address := case
    when new.delivery_method = 'shipping'
      then nullif(left(btrim(coalesce(new.shipping_address, '')), 300), '')
    else null
  end;

  if v_phone is null and v_contact_address is null then
    return new;
  end if;

  insert into public.customer_private_profiles (
    customer_id,
    phone,
    contact_address,
    updated_at
  ) values (
    new.customer_id,
    v_phone,
    v_contact_address,
    now()
  )
  on conflict (customer_id) do update set
    phone = coalesce(excluded.phone, customer_private_profiles.phone),
    contact_address = coalesce(excluded.contact_address, customer_private_profiles.contact_address),
    updated_at = now();

  return new;
end;
$$;

revoke all on function public.sync_customer_contact_profile_from_order() from public, anon, authenticated;
grant execute on function public.sync_customer_contact_profile_from_order() to service_role;

drop trigger if exists sync_customer_contact_profile_after_physical_order on public.physical_orders;
create trigger sync_customer_contact_profile_after_physical_order
after insert on public.physical_orders
for each row execute function public.sync_customer_contact_profile_from_order();
