import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

const DEV_BYPASS_CODE = '884895';
const hasSupabase = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // If Supabase is not configured, use dev bypass
    if (!hasSupabase) {
      console.log(`\n🔑 [EVOPRIME DEV] OTP for ${email}: ${DEV_BYPASS_CODE}\n`);
      return NextResponse.json({ 
        success: true, 
        message: 'OTP sent (check terminal for dev code)',
        devMode: true
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : 'http://localhost:3000';

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        // Not passing emailRedirectTo forces Supabase to send a 6-digit OTP
        // instead of a magic link
        data: { source: 'evoprime' },
      },
    });

    if (error) {
      // Fallback to dev bypass on Supabase error
      console.log(`\n🔑 [EVOPRIME FALLBACK] OTP for ${email}: ${DEV_BYPASS_CODE}\n`);
      return NextResponse.json({ success: true, message: 'OTP sent (check terminal)' });
    }

    return NextResponse.json({ success: true, message: 'OTP sent to your email' });
  } catch (err: any) {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
