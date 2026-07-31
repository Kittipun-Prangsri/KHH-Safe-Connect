'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartHandshake, LayoutDashboard, Users, Calendar, PhoneCall, MessageSquare, BookOpen, Settings, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'หน้าแรก', icon: LayoutDashboard },
    { href: '/patients', label: 'ทะเบียนผู้ป่วย', icon: Users },
    { href: '/appointments', label: 'นัดหมาย', icon: Calendar },
    { href: '/follow-ups', label: 'งานติดตาม', icon: PhoneCall },
    { href: '/reply', label: 'กล่องข้อความ Reply', icon: MessageSquare, badge: 3 },
    { href: '/education', label: 'คำแนะนำสุขภาพ', icon: BookOpen },
  ];

  return (
    <nav className="glassmorphism border-b border-white/5 sticky top-0 z-50 px-6 py-4 flex items-center justify-between shadow-md">
      {/* Brand Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 group">
        <div className="p-1.5 rounded-lg bg-clinical-500 text-white shadow-glow transition-all group-hover:scale-105">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-sm tracking-wider text-white">KHH SAFE-CONNECT</span>
          <span className="block text-[8px] text-clinical-400 font-bold uppercase tracking-widest leading-none">NCDs Dashboard</span>
        </div>
      </Link>

      {/* Main Nav Links */}
      <div className="hidden lg:flex items-center gap-1.5 bg-navy-950/40 p-1 rounded-xl border border-white/5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname?.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all relative ${
                isActive
                  ? 'bg-clinical-500 text-white shadow-sm font-bold'
                  : 'text-navy-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
              {item.badge && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center justify-center animate-pulse">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Right Side: Profile Info & Logout */}
      <div className="flex items-center gap-4">
        {/* User Card */}
        <div className="flex items-center gap-2.5 border-l border-white/10 pl-4">
          <div className="text-right hidden sm:block">
            <span className="block text-xs font-bold text-white">กิตติพงษ์ แก้วมณี</span>
            <span className="block text-[10px] text-clinical-400 font-medium">พยาบาลวิชาชีพ (Nurse)</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-clinical-500/20 border border-clinical-500/40 flex items-center justify-center text-xs font-bold text-clinical-300">
            กแก
          </div>
        </div>

        {/* Settings button */}
        <Link
          href="/settings"
          className="p-2 rounded-lg border border-white/5 hover:bg-white/5 text-navy-300 hover:text-white transition-all"
          title="ตั้งค่า"
        >
          <Settings className="w-4 h-4" />
        </Link>

        {/* Logout */}
        <Link
          href="/"
          className="p-2 rounded-lg border border-rose-500/10 bg-rose-500/5 hover:bg-rose-500/10 text-rose-400 transition-all"
          title="ออกจากระบบ"
        >
          <LogOut className="w-4 h-4" />
        </Link>
      </div>
    </nav>
  );
}
