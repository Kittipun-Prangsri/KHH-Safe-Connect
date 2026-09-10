'use client';

import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function HealthIdCallbackPage() {
  const [statusMsg, setStatusMsg] = useState('กำลังยืนยันตัวตนผ่าน HealthID (moph.id.th)...');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const processCallback = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        setIsError(true);
        setStatusMsg(`ยกเลิกการเข้าสู่ระบบ HealthID: ${error}`);
        return;
      }

      if (!code) {
        setIsError(true);
        setStatusMsg('ไม่พบ Authorization Code จากระบบ HealthID');
        return;
      }

      const providerId = params.get('provider_id') || params.get('providerId') || params.get('doctorcode') || params.get('pid') || params.get('id');
      const cid = params.get('cid') || params.get('national_id') || params.get('id_card') || params.get('health_id');
      const name = params.get('name') || params.get('name_th') || params.get('full_name') || params.get('fullname') || params.get('th_name');
      const position = params.get('position') || params.get('entryposition') || params.get('job_title');

      try {
        const res = await fetch('/api/auth/healthid/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code,
            providerId,
            cid,
            name,
            position,
            queryParams: Object.fromEntries(params.entries()),
          }),
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(data.message || 'ไม่สามารถยืนยันตัวตนผ่าน HealthID ได้');
        }

        if (typeof window !== 'undefined') {
          localStorage.setItem('khh_user_session', JSON.stringify(data.user));
        }

        setStatusMsg(`เข้าสู่ระบบสำเร็จ! ยินดีต้อนรับ ${data.user?.name || ''}`);

        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 800);
      } catch (err: any) {
        setIsError(true);
        setStatusMsg(err.message || 'เกิดข้อผิดพลาดในการประมวลผล HealthID SSO');
      }
    };

    processCallback();
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-2xl text-center space-y-5">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg">
          {isError ? (
            <AlertCircle className="w-8 h-8 text-rose-200" />
          ) : (
            <ShieldCheck className="w-8 h-8 text-white animate-pulse" />
          )}
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-slate-800">HealthID (moph.id.th) SSO</h2>
          <p className="text-xs text-slate-500 mt-1">ระบบยืนยันตัวตนดิจิทัล บุคลากรสาธารณสุข</p>
        </div>

        <div className={`p-4 rounded-xl text-xs font-medium border ${
          isError ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          <div className="flex items-center justify-center gap-2">
            {!isError && <RefreshCw className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />}
            <span>{statusMsg}</span>
          </div>
        </div>

        {isError && (
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            กลับสู่หน้าหลัก (เข้าสู่ระบบใหม่)
          </button>
        )}
      </div>
    </div>
  );
}
