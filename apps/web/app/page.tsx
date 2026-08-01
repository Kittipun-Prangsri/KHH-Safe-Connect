'use client';

import React, { useState } from 'react';
import { Shield, Lock, User, Activity, ArrowRight, HeartHandshake, UserCheck } from 'lucide-react';
import { PRESET_USERS, UserRole } from '@/lib/rbac';

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('nurse');
  const [email, setEmail] = useState(PRESET_USERS.nurse.email);
  const [password, setPassword] = useState('12345678');
  const [loading, setLoading] = useState(false);

  const roleOptions: { id: UserRole; label: string; desc: string }[] = [
    { id: 'nurse', label: '👩‍⚕️ พยาบาล NCDs', desc: 'ติดตามผู้ป่วย, สร้างนัด, ส่ง LINE' },
    { id: 'doctor', label: '👨‍⚕️ แพทย์ผู้ตรวจ', desc: 'ดูประวัติการรักษา, สั่งการนัด' },
    { id: 'staff', label: '📋 เจ้าหน้าที่เวชระเบียน', desc: 'ลงทะเบียน, พิมพ์รายงาน' },
    { id: 'executive', label: '📊 ผู้บริหาร (ผอ.)', desc: 'ดูสถิติภาพรวม (Read-Only)' },
    { id: 'super_admin', label: '🛡️ ผู้ดูแลระบบ IT', desc: 'จัดการสิทธิ์, ตั้งค่า HOSxP' },
  ];

  const handleRoleSelect = (roleId: UserRole) => {
    setSelectedRole(roleId);
    setEmail(PRESET_USERS[roleId].email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const userObj = PRESET_USERS[selectedRole];
    if (typeof window !== 'undefined') {
      localStorage.setItem('khh_user_session', JSON.stringify(userObj));
      document.cookie = `user_role=${userObj.role}; path=/; max-age=86400`;
    }

    setTimeout(() => {
      setLoading(false);
      window.location.href = '/dashboard';
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Left Banner: Brand and Dark Teal Atmosphere */}
      <div className="md:w-1/2 flex flex-col justify-between p-8 md:p-16 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Top Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-teal-500 text-white shadow-lg">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-wider text-white">KHH SAFE-CONNECT</h1>
            <span className="text-[10px] text-teal-300 font-bold uppercase tracking-widest block">NCDs Care & Requisition Portal</span>
          </div>
        </div>

        {/* Middle Value Proposition */}
        <div className="relative z-10 my-12 space-y-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
            <Activity className="w-3.5 h-3.5" /> ระบบจัดการและติดตามผู้ป่วยโรคเรื้อรัง (RBAC Security)
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            เชื่อมโยงการดูแลผู้ป่วย NCDs <br />
            <span className="text-teal-400">อย่างเป็นระบบและปลอดภัย</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-md leading-relaxed">
            ระบบแบ่งระดับสิทธิ์ 5 บทบาทตามมาตรฐาน PDPA โรงพยาบาล ควบคุมการเข้าถึงข้อมูลประวัติการรักษา การเลื่อนนัดหมาย และการส่งสถิติตามหน้าที่
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-4">
          <span>โรงพยาบาลคลองหาด (KHH Hospital)</span>
          <span>Version 1.2.0 (RBAC Enforced)</span>
        </div>
      </div>

      {/* Right Form: Login Card */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">เข้าสู่ระบบ (Sign In)</h3>
            <p className="text-xs text-slate-500 mt-1">เลือกระดับสิทธิ์ผู้ใช้งาน (Role-Based Access Control)</p>
          </div>

          {/* Preset Roles Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-teal-600" />
              <span>เลือกระดับสิทธิ์เข้าใช้งาน (Role Preview):</span>
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {roleOptions.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRoleSelect(item.id)}
                  className={`w-full p-2.5 rounded-xl border text-xs text-left transition-all cursor-pointer flex items-center justify-between ${
                    selectedRole === item.id
                      ? 'border-teal-500 bg-teal-50/80 text-teal-900 font-bold shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div>
                    <span className="block font-bold text-slate-800">{item.label}</span>
                    <span className="block text-[10px] text-slate-500 font-normal">{item.desc}</span>
                  </div>
                  {selectedRole === item.id && <div className="w-2.5 h-2.5 rounded-full bg-teal-600 shadow-sm" />}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">อีเมลผู้ใช้งาน (Email)</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">รหัสผ่าน (Password / HOSxP Password)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>กำลังตรวจสอบสิทธิ์และสร้างเซสชัน...</span>
              ) : (
                <>
                  <span>เข้าสู่ระบบตามสิทธิ์</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
