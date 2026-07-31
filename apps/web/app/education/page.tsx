'use client';

import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { BookOpen, Utensils, Heart, Pill, CheckCircle, Search, Plus, Award } from 'lucide-react';

interface Topic {
  id: string;
  category: 'diet' | 'stress' | 'medication';
  code: string;
  title: string;
  content: string;
  targetDiseases: string[];
}

export default function EducationPage() {
  const [activeTab, setActiveTab] = useState<'diet' | 'stress' | 'medication'>('diet');

  const topics: Topic[] = [
    {
      id: 'e1',
      category: 'diet',
      code: 'DIET-DM-01',
      title: 'การควบคุมปริมาณคาร์โบไฮเดรตและดัชนีน้ำตาล (Glycemic Index)',
      content: 'หลีกเลี่ยงน้ำหวาน ขนมหวาน ปรับเปลี่ยนมารับประทานข้าวกล้อง ขนมปังโฮลวีต และจำกัดผลไม้หวานจัดไม่เกิน 1 กำมือต่อวัน',
      targetDiseases: ['DM', 'CKD'],
    },
    {
      id: 'e2',
      category: 'diet',
      code: 'DIET-HT-01',
      title: 'การลดโซเดียมและอาหารแปรรูป (DASH Diet)',
      content: 'จำกัดเกลือไม่เกิน 1 ช้อนชาต่อวัน หลีกเลี่ยงผงชูรส บะหมี่กึ่งสำเร็จรูป อาหารหมักดอง และน้ำซุปเข้มข้น',
      targetDiseases: ['HT', 'CKD'],
    },
    {
      id: 'e3',
      category: 'stress',
      code: 'STRESS-01',
      title: 'เทคนิคการผ่อนคลายความเครียดและการนอนหลับคุณภาพ',
      content: 'ฝึกการหายใจเข้าลึกออกยาว (4-7-8 Breathing) หลีกเลี่ยงการหน้าจอสมาร์ทโฟนก่อนนอน 1 ชั่วโมง เข้านอนเวลาเดิมทุกวัน',
      targetDiseases: ['HT', 'DM', 'ASTHMA'],
    },
    {
      id: 'e4',
      category: 'medication',
      code: 'MED-DM-01',
      title: 'การทานยาเบาหวานและสังเกตอาการภาวะน้ำตาลในเลือดต่ำ (Hypoglycemia)',
      content: 'รับประทานยาตามเวลาที่แพทย์สั่ง หากมีอาการใจสั่น เหงื่อออก ตาพร่า ให้ทานอมยิ้มหรือน้ำหวาน 1/2 แก้วทันที',
      targetDiseases: ['DM'],
    },
  ];

  const filteredTopics = topics.filter((t) => t.category === activeTab);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
              <BookOpen className="w-7 h-7 text-teal-600" />
              <span>คลังคำแนะนำการปฏิบัติตัว (Health Education)</span>
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">คำแนะนำเฉพาะบุคคล 3 หมวดหลัก (อาหาร, ความเครียด/การนอน, การใช้ยา) สำหรับผู้ป่วย NCDs</p>
          </div>
          <button
            onClick={() => alert('บันทึกการให้คำแนะนำผู้ป่วย')}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>บันทึกการให้คำแนะนำ</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 border-b border-slate-200 pb-2">
          {[
            { id: 'diet', label: '1. การรับประทานอาหาร', icon: Utensils },
            { id: 'stress', label: '2. ความเครียดและการนอน', icon: Heart },
            { id: 'medication', label: '3. การใช้ยาและข้อควรระวัง', icon: Pill },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Topics List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTopics.map((topic) => (
            <div key={topic.id} className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4 hover-grow">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-teal-600 font-mono font-bold">{topic.code}</span>
                  <div className="flex gap-1">
                    {topic.targetDiseases.map((d) => (
                      <span key={d} className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-2">{topic.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">{topic.content}</p>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-teal-600" /> คำแนะนำมาตรฐานทางการแพทย์
                </span>
                <button
                  onClick={() => alert(`คัดลอกคำแนะนำ: ${topic.title}`)}
                  className="px-3 py-1.5 bg-teal-50 text-teal-700 hover:bg-teal-600 hover:text-white rounded-lg text-xs font-semibold transition-all border border-teal-200 cursor-pointer"
                >
                  ส่งให้ผู้ป่วย
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
