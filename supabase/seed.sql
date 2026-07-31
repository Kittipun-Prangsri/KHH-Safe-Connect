-- Seed script for KHH Safe-Connect

-- 1. Default Organization
INSERT INTO public.organizations (code, name, organization_type, is_active)
VALUES ('KHH', 'โรงพยาบาลส่งเสริมสุขภาพตำบล KHH', 'hospital', TRUE)
ON CONFLICT (code) DO NOTHING;

-- 2. Disease Master
INSERT INTO public.disease_master (code, name_th, name_en, is_active)
VALUES 
  ('DM', 'โรคเบาหวาน', 'Diabetes Mellitus', TRUE),
  ('HT', 'โรคความดันโลหิตสูง', 'Hypertension', TRUE),
  ('CKD', 'โรคไตเรื้อรัง', 'Chronic Kidney Disease', TRUE),
  ('COPD', 'โรคปอดอุดกั้นเรื้อรัง', 'Chronic Obstructive Pulmonary Disease', TRUE),
  ('ASTHMA', 'โรคหืด', 'Asthma', TRUE)
ON CONFLICT (code) DO NOTHING;
