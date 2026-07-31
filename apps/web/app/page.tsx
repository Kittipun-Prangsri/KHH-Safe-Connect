'use client';

import React, { useState } from 'react';
import { Shield, Lock, User, Activity, ArrowRight, HeartHandshake } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('nurse');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate navigation/auth check for foundation phase
    setTimeout(() => {
      setLoading(false);
      alert('เข้าสู่ระบบสำเร็จ (โหมดการพัฒนา)');
    }, 1000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen">
      {/* Left Banner: Brand and Info */}
      <div className="md:w-1/2 flex flex-col justify-between p-8 md:p-16 bg-navy-800/40 relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5">
        {/* Decorative Glowing Orbs */}
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-clinical-500/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-clinical-500/10 blur-3xl" />

        <div className="z-10 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-clinical-500 text-white shadow-glow">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <span className="font-semibold text-lg text-white tracking-wider">KHH SAFE-CONNECT</span>
            <div className="text-[10px] text-clinical-400 font-bold uppercase tracking-widest">NCDs Patient Care Platform</div>
          </div>
        </div>

        <div className="z-10 my-16 md:my-auto max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-clinical-500/15 text-clinical-300 border border-clinical-500/30 text-xs font-semibold mb-6">
            <Activity className="w-4 h-4 animate-pulse" />
            ระบบปฏิบัติการสำหรับเจ้าหน้าที่
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
            เชื่อมต่อการดูแลผู้ป่วย <span className="text-transparent bg-clip-text bg-gradient-to-r from-clinical-400 to-clinical-300">NCDs</span> อย่างปลอดภัยและต่อเนื่อง
          </h1>
          <p className="text-navy-200 leading-relaxed text-sm md:text-base">
            ระบบบริหารข้อมูลประวัติติดตาม นัดหมาย การสื่อสารสองทาง และการวิเคราะห์คำแนะนำการดูแลสุขภาพเฉพาะบุคคลสำหรับผู้ป่วยเบาหวาน ความดันโลหิตสูง และกลุ่มโรคไม่ติดต่อเรื้อรัง
          </p>
        </div>

        <div className="z-10 text-xs text-navy-400">
          &copy; {new Date().getFullYear()} โรงพยาบาลส่งเสริมสุขภาพตำบล KHH. สงวนลิขสิทธิ์ทั้งหมด.
        </div>
      </div>

      {/* Right Section: Glassmorphic Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-16 relative">
        {/* Background Decorative Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-clinical-500/5 blur-3xl" />

        <div className="w-full max-w-md p-8 rounded-2xl glassmorphism hover-grow shadow-glass border border-white/10 z-10">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">ลงชื่อเข้าใช้งาน</h2>
            <p className="text-navy-300 text-sm">เข้าสู่ระบบการบริหารการนัดหมายและการตอบกลับผู้ป่วย</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-navy-200 uppercase tracking-wider mb-2">บทบาทผู้ใช้ (สำหรับเข้าทดสอบ)</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'nurse', label: 'พยาบาล (Nurse)' },
                  { id: 'doctor', label: 'แพทย์ (Doctor)' },
                  { id: 'ncd_coordinator', label: 'ผู้ประสานงาน NCDs' },
                  { id: 'hospital_admin', label: 'ผู้ดูแลระบบ' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-all ${
                      role === item.id
                        ? 'bg-clinical-500/20 border-clinical-500 text-clinical-300 font-bold'
                        : 'border-white/5 bg-white/5 text-navy-300 hover:bg-white/10'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-200 uppercase tracking-wider mb-2">อีเมลผู้ใช้</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.go.th"
                  required
                  className="w-full bg-navy-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 placeholder-navy-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-200 uppercase tracking-wider mb-2">รหัสผ่าน</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-navy-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-navy-900/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white text-sm focus:outline-none focus:border-clinical-500 focus:ring-1 focus:ring-clinical-500 placeholder-navy-500 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-navy-300">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded bg-navy-950 border-white/10 text-clinical-500 focus:ring-0 focus:ring-offset-0" />
                <span>จำฉันไว้ในระบบ</span>
              </label>
              <a href="#" className="hover:text-clinical-400 transition-colors">ลืมรหัสผ่าน?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-clinical-600 to-clinical-500 text-white rounded-xl py-3 font-semibold text-sm flex items-center justify-center gap-2 glow-on-hover hover:from-clinical-500 hover:to-clinical-400 transition-all cursor-pointer shadow-md disabled:opacity-50"
            >
              {loading ? (
                <span>กำลังโหลด...</span>
              ) : (
                <>
                  <span>เข้าสู่ระบบ</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-navy-400 uppercase tracking-widest border-t border-white/5 pt-4">
            <Shield className="w-3.5 h-3.5 text-clinical-500" />
            <span>ความปลอดภัยระดับคลินิก (HIPAA-Ready)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
