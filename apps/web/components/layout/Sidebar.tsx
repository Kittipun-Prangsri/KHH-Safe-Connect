'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
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

  const navGroups: {
    label: string;
    items: {
      href: string;
      label: string;
      icon: React.ElementType;
      description?: string;
      multiline?: boolean;
      badge?: string;
      badgeVariant?: 'alert' | 'live' | 'priority';
    }[];
  }[] = [
    {
      label: 'ภาพรวม',
      items: [{ href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }],
    },
    {
      label: 'ผู้ป่วย & นัดหมาย',
      items: [
        { href: '/registry', label: 'ทะเบียน & ติดตามการรักษา', icon: Database },
        { href: '/patients', label: 'ทะเบียนผู้ป่วย NCDs', icon: Users },
        {
          href: '/appointments',
          label: 'รายการนัดหมายผู้ป่วย',
          description: 'HOSxP Real Database',
          icon: Calendar,
          badge: 'LIVE',
          badgeVariant: 'live',
        },
        {
          href: '/follow-ups',
          label: 'งานติดตามผู้ป่วยขาดนัด NCDs',
          description: 'Missed appointment follow-up',
          multiline: true,
          icon: PhoneCall,
          badge: 'NCDs',
          badgeVariant: 'priority',
        },
      ],
    },
    {
      label: 'การสื่อสาร',
      items: [
        {
          href: '/reply',
          label: 'กล่องข้อความ Reply',
          icon: MessageSquare,
          // Dynamic badge from real data
          badge: replyUnreadCount > 0 ? (replyUnreadCount > 99 ? '99+' : String(replyUnreadCount)) : undefined,
        },
        { href: '/education', label: 'คำแนะนำสุขภาพ', icon: BookOpen },
      ],
    },
    {
      label: 'ระบบ',
      items: [
        { href: '/reports', label: 'พิมพ์รายงาน PDF', icon: BarChart3 },
        { href: '/imports', label: 'นำเข้า Excel / CSV', icon: Upload },
        { href: '/settings', label: 'การตั้งค่าระบบ', icon: Settings },
      ],
    },
  ];

  const SidebarContent = (
    <div className="flex flex-col justify-between h-full bg-slate-900 text-slate-300 select-none">
      <div className="min-h-0 flex flex-col">
        {/* Brand Header */}
        <div className="relative p-5 border-b border-slate-800/60 flex items-center justify-between overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-clinical-gradient opacity-30 blur-2xl" />
          <Link href="/dashboard" className="relative flex items-center gap-3 group">
            <img
              src="/khh-safe-connect-symbol.svg"
              alt="KHH Safe-Connect Logo"
              className="w-10 h-10 group-hover:scale-105 transition-transform drop-shadow-[0_0_10px_rgba(20,184,166,0.35)]"
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
              className="relative lg:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav Items List */}
        <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4 space-y-5">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-600">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname?.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen && setMobileOpen(false)}
                      className={`group flex items-center justify-between gap-2 pl-3 pr-3 py-2.5 border-l-[3px] rounded-r-xl text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? 'border-teal-400 bg-gradient-to-r from-teal-500/20 to-cyan-500/5 text-white shadow-[0_8px_20px_-14px_rgba(45,212,191,0.9)]'
                          : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 transition-colors ${
                            isActive
                              ? 'bg-teal-500 text-white shadow-sm shadow-teal-900/40'
                              : 'bg-slate-800/70 text-slate-400 group-hover:text-teal-400 group-hover:bg-slate-800'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 stroke-[2.2]" />
                        </span>
                        <span className="min-w-0">
                          <span className={`block ${item.multiline ? 'line-clamp-2 leading-4' : 'truncate'}`}>{item.label}</span>
                          {item.description && (
                            <span className={`mt-0.5 block truncate text-[9px] font-semibold tracking-wide ${isActive ? 'text-teal-300/90' : 'text-slate-500 group-hover:text-slate-400'}`}>
                              {item.description}
                            </span>
                          )}
                        </span>
                      </div>
                      {item.badge && (
                        <span className={`${
                          item.badgeVariant === 'live'
                            ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30'
                            : item.badgeVariant === 'priority'
                              ? 'bg-amber-400/15 text-amber-200 ring-1 ring-amber-300/30'
                              : 'bg-rose-500 text-white shadow-sm shadow-rose-900/40 animate-pulse'
                        } text-[9px] font-extrabold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shrink-0`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800/60 space-y-3 bg-slate-950/30 shrink-0">
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
