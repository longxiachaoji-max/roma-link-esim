import { NextResponse } from 'next/server';
import { adminApiGuard, getServerSupabase } from '@/lib/server-auth';
import { normalizeAdminNavigation, parseAdminNavigation, withAdminNavigation } from '@/lib/admin-navigation';

export const dynamic = 'force-dynamic';

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : '後台選單設定操作失敗';
}

export async function GET(request: Request) {
  const denied = await adminApiGuard(request);
  if (denied) return denied;

  try {
    const supabase = getServerSupabase();
    const { data, error } = await supabase
      .from('site_settings')
      .select('usage_guide')
      .eq('id', 'main')
      .single();

    if (error) throw error;
    return NextResponse.json({ navigation: parseAdminNavigation(data?.usage_guide) });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const denied = await adminApiGuard(request);
  if (denied) return denied;

  try {
    const navigation = normalizeAdminNavigation(await request.json());
    const supabase = getServerSupabase();
    const { data, error: fetchError } = await supabase
      .from('site_settings')
      .select('usage_guide')
      .eq('id', 'main')
      .single();

    if (fetchError) throw fetchError;
    const { error } = await supabase
      .from('site_settings')
      .update({
        usage_guide: withAdminNavigation(data?.usage_guide, navigation),
        updated_at: new Date().toISOString()
      })
      .eq('id', 'main');

    if (error) throw error;
    return NextResponse.json({ success: true, navigation });
  } catch (error: unknown) {
    return NextResponse.json({ error: errorMessage(error) }, { status: 500 });
  }
}
