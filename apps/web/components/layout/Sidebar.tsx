'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Menu,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const [replyUnreadCount, setReplyUnreadCount] = useState<number>(0);

  // Fetch real unread count from HOSxP/Supabase
  const fetchUnreadCount = async () => {
    try {
      const res = await fetch('/api/hosxp/conversations/unread-count', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && typeof data.count === 'number') {
          setReplyUnreadCount(data.count);
        }
      }
    } catch {
      // Silently ignore — don't break the sidebar on network error
    }
  };

  useEffect(() => {
    // When user is on /reply, reset badge to 0 (they've seen the messages)
    if (pathname?.startsWith('/reply')) {
      setReplyUnreadCount(0);
      return;
    }

    // Initial fetch
    fetchUnreadCount();

    // Poll every 60 seconds
    const interval = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, [pathname]);

  const navItems = [
    { href: '/dashboard', label: 'ภาพรวมระบบ (Dashboard)', icon: LayoutDashboard },
    { href: '/registry', label: 'ทะเบียน & ติดตามการรักษา', icon: Database },
    { href: '/patients', label: 'ทะเบียนผู้ป่วย NCDs', icon: Users },
    { href: '/appointments', label: 'รายการนัดหมาย', icon: Calendar },
    { href: '/follow-ups', label: 'งานติดตามผู้ป่วย', icon: PhoneCall },
    {
      href: '/reply',
      label: 'กล่องข้อความ Reply',
      icon: MessageSquare,
      // Dynamic badge from real data
      badge: replyUnreadCount > 0 ? (replyUnreadCount > 99 ? '99+' : String(replyUnreadCount)) : undefined,
    },
    { href: '/education', label: 'คำแนะนำสุขภาพ', icon: BookOpen },
    { href: '/reports', label: 'พิมพ์รายงาน PDF', icon: BarChart3 },
    { href: '/imports', label: 'นำเข้า Excel / CSV', icon: Upload },
    { href: '/settings', label: 'การตั้งค่าระบบ', icon: Settings },
  ];

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full bg-slate-900 text-slate-300 select-none">
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

        {/* Nav Items List */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-lg shadow-teal-900/20 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 stroke-[2] ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="bg-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full animate-pulse min-w-[18px] text-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800/60 space-y-3 bg-slate-950/30">
        <div className="flex items-center justify-between text-xs bg-slate-800/50 border border-slate-800/60 rounded-xl p-3">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            <span className="font-semibold text-slate-400 text-[11px]">Database Cloud</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-bold text-[10px] text-emerald-400 uppercase">Live</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold px-1">
          <span>KHH Primary Care Platform v1.2</span>
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

