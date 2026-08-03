'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HeartHandshake,
  LayoutDashboard,
  Users,
  Calendar,
  PhoneCall,
  MessageSquare,
  BookOpen,
  BarChart3,
  Upload,
  Settings,
  LogOut,
  X,
  Database,
  ChevronDown,
  ChevronRight,
  Stethoscope,
  Gamepad2,
  Activity,
  Utensils,
  LineChart,
  Disc3,
  Trophy,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const [clinicalOpen, setClinicalOpen] = useState(() =>
    ['/dashboard/triage', '/dashboard/nutrition-eval', '/reports/clinical-correlation'].some(p => pathname?.startsWith(p))
  );
  const [gameOpen, setGameOpen] = useState(() =>
    pathname?.startsWith('/game')
  );

  // Helper: nav link style
  const navLink = (href: string, label: string, Icon: React.ElementType, badge?: string) => {
    const isActive = pathname === href || (href !== '/dashboard' && pathname?.startsWith(href));
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMobileOpen && setMobileOpen(false)}
        className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
          isActive
            ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20'
            : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
        }`}
      >
        <div className="flex items-center gap-3">
          <Icon className={`w-4 h-4 stroke-[2] ${isActive ? 'text-white' : 'text-slate-400'}`} />
          <span>{label}</span>
        </div>
        {badge && (
          <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse">
            {badge}
          </span>
        )}
      </Link>
    );
  };

  // Sub-item link (indented)
  const subLink = (href: string, label: string, Icon: React.ElementType) => {
    const isActive = pathname?.startsWith(href);
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setMobileOpen && setMobileOpen(false)}
        className={`flex items-center gap-2.5 pl-9 pr-3 py-2 rounded-xl text-[11px] font-semibold transition-all ${
          isActive
            ? 'bg-teal-700/60 text-teal-200'
            : 'text-slate-500 hover:text-slate-200 hover:bg-slate-800/40'
        }`}
      >
        <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-300' : 'text-slate-500'}`} />
        {label}
      </Link>
    );
  };

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full bg-slate-900 text-slate-300 select-none overflow-y-auto">
      <div>
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <img
              src="/khh-safe-connect-symbol.svg"
              alt="KHH Safe-Connect Logo"
              className="w-10 h-10 group-hover:scale-105 transition-transform"
            />
            <div>
              <h1 className="text-xs font-extrabold text-white tracking-wider uppercase">KHH SAFE-CONNECT</h1>
              <p className="text-[9px] text-teal-400 font-semibold tracking-wider uppercase mt-0.5">
                NCDs Care &amp; Requisition Portal
              </p>
            </div>
          </Link>
          {setMobileOpen && (
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav Items */}
        <nav className="p-3 space-y-0.5">
          {/* === Main Navigation === */}
          {navLink('/dashboard', 'ภาพรวมระบบ', LayoutDashboard)}
          {navLink('/patients', 'ทะเบียนผู้ป่วย NCDs', Users)}
          {navLink('/appointments', 'รายการนัดหมาย', Calendar)}
          {navLink('/follow-ups', 'งานติดตามผู้ป่วย', PhoneCall)}
          {navLink('/reply', 'กล่องข้อความ Reply', MessageSquare, '3')}

          {/* === Clinical Tools Group === */}
          <div className="pt-2">
            <button
              onClick={() => setClinicalOpen(!clinicalOpen)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-all"
            >
              <div className="flex items-center gap-2">
                <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
                <span>Clinical Tools</span>
              </div>
              {clinicalOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {clinicalOpen && (
              <div className="mt-0.5 space-y-0.5">
                {subLink('/dashboard/triage', 'Triage Dashboard', Activity)}
                {subLink('/dashboard/nutrition-eval', 'ประเมินมื้ออาหาร', Utensils)}
                {subLink('/reports/clinical-correlation', 'Clinical Correlation', LineChart)}
              </div>
            )}
          </div>

          {/* === Game & Education Group === */}
          <div className="pt-1">
            <button
              onClick={() => setGameOpen(!gameOpen)}
              className="w-full flex items-center justify-between px-4 py-2 rounded-xl text-[11px] font-extrabold uppercase tracking-wider text-slate-500 hover:text-slate-300 hover:bg-slate-800/40 transition-all"
            >
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />
                <span>Game & Education</span>
              </div>
              {gameOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            {gameOpen && (
              <div className="mt-0.5 space-y-0.5">
                {subLink('/game/carb-wheel', 'Carb Wheel', Disc3)}
                {subLink('/game/volvelle', 'Volvelle Wheel', Disc3)}
                {subLink('/game/quests', 'Quests & XP', Trophy)}
              </div>
            )}
          </div>

          {/* === More === */}
          <div className="pt-2 border-t border-slate-800/60 mt-2 space-y-0.5">
            {navLink('/education', 'คำแนะนำสุขภาพ', BookOpen)}
            {navLink('/reports', 'รายงาน & Analytics', BarChart3)}
            {navLink('/imports', 'นำเข้า Excel / CSV', Upload)}
            {navLink('/settings', 'การตั้งค่าระบบ', Settings)}
          </div>
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800/60 space-y-3 bg-slate-950/30">
        <div className="flex items-center justify-between text-xs bg-slate-800/50 border border-slate-800/60 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold text-slate-400 text-[11px]">HOSxP Database</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[10px] text-emerald-400 uppercase">Live</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-1">
          <span>KHH Platform v1.2</span>
          <Link href="/" className="text-rose-400 hover:underline flex items-center gap-1">
            <LogOut className="w-3 h-3" /> ออกจากระบบ
          </Link>
        </div>
      </div>
    </div>
  );


  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-slate-300 border-r border-slate-800 shrink-0 h-screen sticky top-0 select-none">
        {SidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen && setMobileOpen(false)}
          />
          <div className="relative w-64 max-w-xs bg-slate-900 h-full shadow-2xl z-10">
            {SidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
