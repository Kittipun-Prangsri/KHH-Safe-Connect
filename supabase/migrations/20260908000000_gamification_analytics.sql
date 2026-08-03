-- Create Migration for Gamification & Digital Evaluation System
-- KHH Safe-Connect / NCDs-KHH

-- 1. Game Profiles Table
CREATE TABLE IF NOT EXISTS public.game_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    total_xp INT NOT NULL DEFAULT 0,
    coins INT NOT NULL DEFAULT 0,
    streak_days INT NOT NULL DEFAULT 0,
    current_tier VARCHAR(50) NOT NULL DEFAULT 'Carb Learner',
    last_active_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    CONSTRAINT uq_game_profiles_patient UNIQUE (patient_id)
);

-- 2. Carb Wheel Meal Logs Table
CREATE TABLE IF NOT EXISTS public.carb_wheel_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    meal_type VARCHAR(20) NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    photo_url TEXT,
    carb_score NUMERIC(3, 2) CHECK (carb_score >= 0 AND carb_score <= 5.0),
    evaluator_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    evaluator_name VARCHAR(255),
    nutritionist_notes TEXT,
    alert_status VARCHAR(20) DEFAULT 'green' CHECK (alert_status IN ('green', 'yellow', 'red')),
    portion_211_correct BOOLEAN DEFAULT TRUE,
    submitted_at TIMESTAMPTZ DEFAULT now(),
    evaluated_at TIMESTAMPTZ
);

-- 3. Patient Quest Logs Table
CREATE TABLE IF NOT EXISTS public.patient_quest_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    quest_code VARCHAR(50) NOT NULL,
    quest_title VARCHAR(255) NOT NULL,
    xp_earned INT NOT NULL DEFAULT 0,
    coins_earned INT NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Platform Engagement Logs Table
CREATE TABLE IF NOT EXISTS public.platform_engagement_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    line_user_id VARCHAR(255),
    event_type VARCHAR(50) NOT NULL, -- e.g. 'rich_menu_click', 'quest_submitted', 'appointment_response'
    rich_menu_category VARCHAR(50), -- e.g. 'carb_wheel', 'medication', 'mental_health', 'appointment'
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Clinical Outbound Integration Logs Table
CREATE TABLE IF NOT EXISTS public.clinical_integration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
    hn VARCHAR(50) NOT NULL,
    hba1c NUMERIC(4, 2),
    fbs NUMERIC(5, 2),
    body_weight NUMERIC(5, 2),
    bp_sys INT,
    bp_dia INT,
    is_remission BOOLEAN DEFAULT FALSE,
    weekly_nutrition_score NUMERIC(3, 2),
    engagement_score INT DEFAULT 0,
    lab_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for high-performance analytics
CREATE INDEX IF NOT EXISTS idx_carb_logs_patient ON public.carb_wheel_logs(patient_id, submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_carb_logs_alert ON public.carb_wheel_logs(alert_status);
CREATE INDEX IF NOT EXISTS idx_engagement_patient ON public.platform_engagement_logs(patient_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_clinical_logs_hn ON public.clinical_integration_logs(hn, lab_date DESC);

-- RLS Policies
ALTER TABLE public.game_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carb_wheel_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_quest_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_engagement_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clinical_integration_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to select game profiles
CREATE POLICY "Allow public read access to game_profiles" ON public.game_profiles FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert/update game_profiles" ON public.game_profiles FOR ALL USING (true);

CREATE POLICY "Allow read carb_wheel_logs" ON public.carb_wheel_logs FOR SELECT USING (true);
CREATE POLICY "Allow insert/update carb_wheel_logs" ON public.carb_wheel_logs FOR ALL USING (true);

CREATE POLICY "Allow read patient_quest_logs" ON public.patient_quest_logs FOR SELECT USING (true);
CREATE POLICY "Allow insert patient_quest_logs" ON public.patient_quest_logs FOR ALL USING (true);

CREATE POLICY "Allow read platform_engagement_logs" ON public.platform_engagement_logs FOR SELECT USING (true);
CREATE POLICY "Allow insert platform_engagement_logs" ON public.platform_engagement_logs FOR ALL USING (true);

CREATE POLICY "Allow read clinical_integration_logs" ON public.clinical_integration_logs FOR SELECT USING (true);
CREATE POLICY "Allow insert clinical_integration_logs" ON public.clinical_integration_logs FOR ALL USING (true);
