'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, LogOut, Settings, User } from 'lucide-react';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200/80 px-4 py-3 lg:px-8 lg:py-4 flex items-center justify-between shadow-sm shrink-0 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-50 lg:hidden transition-colors cursor-pointer"
          title="เปิดเมนู"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        <span className="hidden sm:inline-flex text-xs font-bold bg-teal-50 text-teal-700 border border-teal-200/60 px-2.5 py-1 rounded-md">
          เครือข่ายบริการปฐมภูมิ
        </span>
        <span className="hidden sm:inline text-xs text-slate-300 font-medium">|</span>
        <span className="text-xs text-slate-600 font-bold truncate max-w-[140px] sm:max-w-none">
          รพ.คลองหาด (KHH)
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* User Card */}
        <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200/80 px-3 py-1.5 rounded-xl">
          <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
            กแก
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-bold text-slate-800 leading-tight">กิตติพงษ์ แก้วมณี</span>
            <span className="block text-[9px] text-teal-600 font-semibold leading-none">พยาบาลวิชาชีพ (Nurse)</span>
          </div>
        </div>

        {/* Settings button */}
        <Link
          href="/settings"
          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-teal-700 transition-all shadow-sm"
          title="ตั้งค่าระบบ"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Logout button */}
        <Link
          href="/"
          className="p-2 rounded-xl border border-rose-100 bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
          title="ออกจากระบบ"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}
