import { NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/supabaseClient';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId') || 'demo-patient-001';

    const supabase = getSupabaseAdminClient();
    const { data, error } = await supabase
      .from('game_profiles')
      .select('*')
      .eq('patient_id', patientId)
      .single();

    if (error || !data) {
      // Fallback demo game profile
      return NextResponse.json({
        success: true,
        profile: {
          patient_id: patientId,
          total_xp: 350,
          coins: 120,
          streak_days: 5,
          current_tier: 'Carb Control Fighter',
          last_active_at: new Date().toISOString(),
          badges: [
            { id: 'badge-1', title: 'ผู้เริ่มต้นเรียนรู้คาร์บ', icon: '🌱', date: '2026-08-01' },
            { id: 'badge-2', title: 'เจ้าแห่งวงล้อ 2:1:1', icon: '🥗', date: '2026-08-15' },
            { id: 'badge-3', title: 'นักเดินลดน้ำตาล', icon: '🚶‍♂️', date: '2026-08-20' },
          ]
        }
      });
    }

    return NextResponse.json({ success: true, profile: data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { patientId, addXp = 0, addCoins = 0, questCode } = body;

    if (!patientId) {
      return NextResponse.json({ success: false, error: 'Missing patientId' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();

    // Fetch existing or insert
    const { data: existing } = await supabase
      .from('game_profiles')
      .select('*')
      .eq('patient_id', patientId)
      .single();

    const currentXp = (existing?.total_xp || 350) + addXp;
    const currentCoins = (existing?.coins || 120) + addCoins;

    // Calculate Tier based on XP
    let currentTier = 'Carb Learner';
    if (currentXp >= 1000) currentTier = 'Remission Hero';
    else if (currentXp >= 300) currentTier = 'Carb Control Fighter';

    const updatedProfile = {
      patient_id: patientId,
      total_xp: currentXp,
      coins: currentCoins,
      current_tier: currentTier,
      streak_days: (existing?.streak_days || 5) + 1,
      last_active_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await supabase
      .from('game_profiles')
      .upsert(updatedProfile, { onConflict: 'patient_id' });

    // Log quest if present
    if (questCode) {
      await supabase.from('patient_quest_logs').insert({
        patient_id: patientId,
        quest_code: questCode,
        quest_title: questCode,
        xp_earned: addXp,
        coins_earned: addCoins,
      });
    }

    return NextResponse.json({
      success: true,
      message: `ได้รับ +${addXp} XP และ +${addCoins} Coins!`,
      profile: updatedProfile
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
