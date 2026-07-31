'use client';

import React, { useState } from 'react';
import { Shield, Lock, User, Activity, ArrowRight, HeartHandshake } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('nurse@khh.go.th');
  const [password, setPassword] = useState('12345678');
  const [role, setRole] = useState('nurse');
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 'nurse', label: 'พยาบาล (Nurse)', email: 'nurse@khh.go.th' },
    { id: 'doctor', label: 'แพทย์ (Doctor)', email: 'doctor@khh.go.th' },
    { id: 'ncd_coordinator', label: 'ผู้ประสานงาน NCDs', email: 'coordinator@khh.go.th' },
    { id: 'hospital_admin', label: 'ผู้ดูแลระบบ', email: 'admin@khh.go.th' },
  ];

  const handleRoleSelect = (item: { id: string; email: string }) => {
    setRole(item.id);
    setEmail(item.email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.location.href = '/dashboard';
    }, 400);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-slate-50">
      {/* Left Banner: Brand and Dark Teal Atmosphere */}
      <div className="md:w-1/2 flex flex-col justify-between p-8 md:p-16 bg-gradient-to-br from-slate-900 via-teal-900 to-slate-950 text-white relative overflow-hidden">
        {/* Decorative Glowing Orbs */}
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
            <Activity className="w-3.5 h-3.5" /> ระบบจัดการและติดตามผู้ป่วยโรคเรื้อรัง
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            เชื่อมโยงการดูแลผู้ป่วย NCDs <br />
            <span className="text-teal-400">อย่างเป็นระบบและไร้รอยต่อ</span>
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-md leading-relaxed">
            เพิ่มประสิทธิภาพในการติดตามผู้ป่วยขาดนัด บริหารจัดการวันนัด สื่อสารผ่าน Reply และประเมินความเข้าใจผู้ป่วยได้อย่างแม่นยำ
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between border-t border-white/10 pt-4">
          <span>โรงพยาบาลส่งเสริมสุขภาพตำบล KHH</span>
          <span>Version 1.0.0</span>
        </div>
      </div>

      {/* Right Form: Login Card */}
      <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-8 shadow-xl space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-slate-800">เข้าสู่ระบบ (Sign In)</h3>
            <p className="text-xs text-slate-500 mt-1">เลือกรอบการทดสอบบทบาทหน้าที่เพื่อเข้าใช้งานระบบ</p>
          </div>

          {/* Preset Roles Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">เลือกสิทธิ์ทดสอบเข้าใช้งาน (Role Preview):</label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRoleSelect(item)}
                  className={`p-2.5 rounded-xl border text-xs font-semibold text-left transition-all cursor-pointer flex items-center justify-between ${
                    role === item.id
                      ? 'border-teal-500 bg-teal-50 text-teal-800 font-bold shadow-sm'
                      : 'border-slate-200 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {role === item.id && <div className="w-2 h-2 rounded-full bg-teal-500" />}
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">รหัสผ่าน (Password)</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-xs text-slate-800 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>กำลังตรวจสอบสิทธิ์...</span>
              ) : (
                <>
                  <span>เข้าสู่ระบบ</span>
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
