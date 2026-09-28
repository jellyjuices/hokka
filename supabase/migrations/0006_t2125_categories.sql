-- Expense categories move to the CRA T2125 lines. travel and meals keep their ids.
update public.transactions set category = case category
    when 'software' then 'office_expenses'
    when 'hardware' then 'capital_cost_allowance'
    when 'home_office' then 'business_use_of_home'
    when 'professional' then 'professional_fees'
  end
where category in ('software', 'hardware', 'home_office', 'professional');

update public.tax_settings
set category_claimable_pct = (
  select coalesce(jsonb_object_agg(
    case key
      when 'software' then 'office_expenses'
      when 'hardware' then 'capital_cost_allowance'
      when 'home_office' then 'business_use_of_home'
      when 'professional' then 'professional_fees'
      else key
    end,
    value
  ), '{}'::jsonb)
  from jsonb_each(category_claimable_pct)
)
where category_claimable_pct ?| array['software', 'hardware', 'home_office', 'professional'];
