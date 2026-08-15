-- Content tables for the khh-mobile app's /api/mobile/* endpoints.
-- These have no HOSxP equivalent (education content, gamification) so
-- they live natively in Supabase rather than being synced from anywhere.

CREATE TABLE IF NOT EXISTS public.health_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category VARCHAR(20) NOT NULL CHECK (category IN ('diet', 'medication', 'exercise', 'thai_medicine', 'mental_health')),
    title_th TEXT NOT NULL,
    summary_th TEXT NOT NULL,
    body_th TEXT,
    read_minutes SMALLINT DEFAULT 3,
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.health_articles ENABLE ROW LEVEL SECURITY;
-- Content is non-sensitive and meant to be public within the app, so an
-- anon-read policy is appropriate here (unlike the HOSxP PHI cache
-- tables) — but writes still only ever go through the service-role
-- admin client from server-side code.
CREATE POLICY "Allow public select on published health_articles"
  ON public.health_articles FOR SELECT USING (published = true);
CREATE POLICY "Allow service_role all on health_articles"
  ON public.health_articles FOR ALL TO service_role USING (true);

INSERT INTO public.health_articles (category, title_th, summary_th, read_minutes) VALUES
  ('diet', 'เทคนิคการคุมหวาน-มัน-เค็ม สำหรับผู้ป่วยเบาหวานและความดัน', 'การปรับเปลี่ยนพฤติกรรมการบริโภคอาหาร ใช้วิธีรสมือเบา ชิมก่อนปรุง และลดการกินน้ำซุป', 3),
  ('exercise', 'การออกกำลังกายอย่างปลอดภัยในผู้สูงอายุ', 'เดินออกกำลังกายวันละ 20-30 นาที ช่วยเพิ่มความแข็งแรงของหัวใจและหลอดเลือด', 3),
  ('thai_medicine', 'สมุนไพรไทยกับการดูแลสุขภาพ NCDs', 'การใช้มะระขี้นก มะขามป้อม และสมุนไพรพื้นบ้านตามคำแนะนำของแพทย์แผนไทย', 3)
ON CONFLICT DO NOTHING;
