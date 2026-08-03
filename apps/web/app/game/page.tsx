'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  Flame, 
  Coins, 
  Target, 
  Sparkles, 
  ChevronRight, 
  PieChart, 
  Camera, 
  Footprints, 
  Award,
  CheckCircle2,
  HeartPulse,
  ArrowLeft
} from 'lucide-react';

interface GameProfile {
  patient_id: string;
  total_xp: number;
  coins: number;
  streak_days: number;
  current_tier: string;
  badges: Array<{ id: string; title: string; icon: string; date: string }>;
}

export default function GameDashboardPage() {
  const [profile, setProfile] = useState<GameProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/game/profile')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfile(data.profile);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const totalXp = profile?.total_xp || 350;
  const coins = profile?.coins || 120;
  const streak = profile?.streak_days || 5;
  const tier = profile?.current_tier || 'Carb Control Fighter';
  const xpProgress = Math.min(100, Math.floor(((totalXp % 500) / 500) * 100));

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 pt-8 pb-14 px-4 rounded-b-3xl shadow-xl relative overflow-hidden">
        <div className="max-w-md mx-auto relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-emerald-950/40 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-emerald-200 border border-emerald-400/30">
              <HeartPulse className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>NCDs-KHH Safe-Connect</span>
            </div>
            <Link 
              href="/dashboard" 
              className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full backdrop-blur-sm transition flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> แดชบอร์ด
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">ระดับการสงบโรค</span>
              <h1 className="text-2xl font-bold text-white flex items-center gap-2 mt-0.5">
                {tier} <Sparkles className="w-5 h-5 text-amber-300" />
              </h1>
              <p className="text-emerald-100 text-xs mt-1">เครือข่ายบริการสุขภาพอำเภอคลองหาด</p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-0.5 shadow-lg transform rotate-3 hover:rotate-0 transition">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex flex-col items-center justify-center">
                <Trophy className="w-7 h-7 text-amber-400" />
                <span className="text-[10px] font-bold text-amber-300 mt-0.5">LVL 2</span>
              </div>
            </div>
          </div>

          {/* Stat Pills */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" /> Total XP
              </div>
              <div className="text-lg font-bold text-white mt-1">{totalXp}</div>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-400 text-xs font-medium">
                <Flame className="w-3.5 h-3.5" /> Streak
              </div>
              <div className="text-lg font-bold text-white mt-1">{streak} วัน 🔥</div>
            </div>
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-2.5 text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-400 text-xs font-medium">
                <Coins className="w-3.5 h-3.5" /> Coins
              </div>
              <div className="text-lg font-bold text-white mt-1">{coins} 🪙</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 -mt-6 space-y-6 relative z-20">
        {/* XP Level Progress Card */}
        <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-4 shadow-lg backdrop-blur-md">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-slate-300 font-medium">เป้าหมายสู่ Level 3: Remission Hero</span>
            <span className="text-emerald-400 font-bold">{xpProgress}% ({totalXp}/500 XP)</span>
          </div>
          <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>

        {/* Featured Mini-game Card: Interactive Carb Wheel */}
        <div className="bg-gradient-to-br from-indigo-900/80 to-purple-900/80 border border-indigo-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div className="max-w-[70%]">
              <span className="bg-indigo-500/30 text-indigo-200 text-[11px] font-semibold px-2.5 py-1 rounded-md border border-indigo-400/20 inline-block mb-2">
                🎮 นวัตกรรมคลองหาด
              </span>
              <h2 className="text-xl font-bold text-white leading-tight">
                มินิเกมหมุนวงล้อ<br/>นับคาร์บ 2:1:1
              </h2>
              <p className="text-indigo-200 text-xs mt-1.5 leading-relaxed">
                จัดสัดส่วนอาหาร ทายคาร์บซ่อน และเดินลดน้ำตาล รับโบนัส +100 XP
              </p>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/40 border border-indigo-400/40 flex items-center justify-center text-3xl shadow-inner">
              🎡
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between pt-3 border-t border-indigo-500/20">
            <div className="text-xs text-indigo-300 flex items-center gap-1">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> รางวัลสูงสุด: +100 XP + 50 Coins
            </div>
            <Link
              href="/game/carb-wheel"
              className="bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold px-4 py-2 rounded-xl transition flex items-center gap-1 shadow-md hover:shadow-indigo-500/30"
            >
              เริ่มเล่นเกม <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Daily Quests Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" /> ภารกิจประจำวัน (Daily Quests)
            </h3>
            <Link href="/game/quests" className="text-xs text-emerald-400 hover:underline">
              ดูทั้งหมด
            </Link>
          </div>

          <div className="space-y-3">
            {/* Quest 1 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:border-emerald-500/40 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-100">ส่งรูปภาพอาหารมื้อนี้</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">ส่งเข้า LINE OA เพื่อให้นักโภชนาการประเมิน</div>
                </div>
              </div>
              <Link 
                href="/game/quests" 
                className="bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition"
              >
                +50 XP
              </Link>
            </div>

            {/* Quest 2 */}
            <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-3.5 flex items-center justify-between shadow-sm hover:border-emerald-500/40 transition">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold">
                  <Footprints className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-100">ขยับกายเดิน 10-15 นาทีหลังอาหาร</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">ลดระดับน้ำตาลในเลือดหลังมื้ออาหาร</div>
                </div>
              </div>
              <Link 
                href="/game/carb-wheel" 
                className="bg-teal-600/30 hover:bg-teal-600 text-teal-300 hover:text-white border border-teal-500/40 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition"
              >
                +30 XP
              </Link>
            </div>
          </div>
        </div>

        {/* Badges & Achievements */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> ตราสัญลักษณ์เกียรติยศ (Badges)
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-2.5 text-center">
              <div className="text-2xl mb-1">🌱</div>
              <div className="text-[11px] font-semibold text-slate-200">เรียนรู้คาร์บ</div>
              <div className="text-[9px] text-amber-400 mt-0.5">ปลดล็อกแล้ว</div>
            </div>

            <div className="bg-slate-900/60 border border-amber-500/30 rounded-xl p-2.5 text-center">
              <div className="text-2xl mb-1">🥗</div>
              <div className="text-[11px] font-semibold text-slate-200">เจ้าแห่ง 2:1:1</div>
              <div className="text-[9px] text-amber-400 mt-0.5">ปลดล็อกแล้ว</div>
            </div>

            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-2.5 text-center opacity-60">
              <div className="text-2xl mb-1">👑</div>
              <div className="text-[11px] font-semibold text-slate-300">ฮีโร่สงบโรค</div>
              <div className="text-[9px] text-slate-400 mt-0.5">ต้องสะสม 1000 XP</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
