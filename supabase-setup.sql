-- Supabase Database Setup Script
-- Run this in your Supabase SQL editor

-- 1. Create or update User table with proper columns
CREATE TABLE IF NOT EXISTS public."User" (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    role TEXT CHECK (role IN ('patient', 'doctor', 'nurse', 'pharmacy', 'lab', 'billing', 'reception', 'admin')) DEFAULT 'patient',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create patients table
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    email TEXT,
    contact TEXT,
    age INTEGER,
    gender TEXT,
    prescription TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    doctor_id UUID REFERENCES auth.users(id),
    name TEXT,
    contact TEXT,
    email TEXT,
    date DATE,
    time TEXT,
    fees DECIMAL(10, 2),
    status TEXT DEFAULT 'scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create pharmacy_inventory table
CREATE TABLE IF NOT EXISTS public.pharmacy_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    medicine_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 0,
    batch_number TEXT,
    expiry_date DATE,
    unit_price DECIMAL(10, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create pharmacy_prescriptions table
CREATE TABLE IF NOT EXISTS public.pharmacy_prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id),
    doctor_id UUID REFERENCES auth.users(id),
    prescription_date DATE,
    medicines JSONB,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create lab_test_orders table
CREATE TABLE IF NOT EXISTS public.lab_test_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id),
    doctor_id UUID REFERENCES auth.users(id),
    test_name TEXT,
    order_date DATE,
    results_date DATE,
    status TEXT DEFAULT 'pending',
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Create billing_bills table
CREATE TABLE IF NOT EXISTS public.billing_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id),
    bill_date DATE,
    total_amount DECIMAL(10, 2),
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    payment_status TEXT DEFAULT 'pending',
    payment_method TEXT,
    insurance_claim_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Create nursing_assignments table
CREATE TABLE IF NOT EXISTS public.nursing_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id),
    nurse_id UUID REFERENCES auth.users(id),
    assignment_date DATE,
    shift TEXT CHECK (shift IN ('morning', 'evening', 'night')),
    room_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Create nursing_vital_signs table
CREATE TABLE IF NOT EXISTS public.nursing_vital_signs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES auth.users(id),
    nurse_id UUID REFERENCES auth.users(id),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    blood_pressure TEXT,
    heart_rate INTEGER,
    temperature DECIMAL(4, 1),
    oxygen_saturation INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Enable Row Level Security (RLS) on all tables
ALTER TABLE public."User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pharmacy_prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_test_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nursing_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nursing_vital_signs ENABLE ROW LEVEL SECURITY;

-- 11. Create RLS policies for User table
CREATE POLICY "Users can view own profile" ON public."User"
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public."User"
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users" ON public."User"
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 12. Create RLS policies for patients table
CREATE POLICY "Patients can view own records" ON public.patients
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients can update own records" ON public.patients
    FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Enable insert for patients" ON public.patients
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Doctors can view all patients" ON public.patients
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public."User"
            WHERE id = auth.uid() AND role = 'doctor'
        )
    );

-- 13. Create RLS policies for appointments
CREATE POLICY "Users can view own appointments" ON public.appointments
    FOR SELECT USING (
        auth.uid() = patient_id OR auth.uid() = doctor_id
    );

CREATE POLICY "Patients can create appointments" ON public.appointments
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update own appointments" ON public.appointments
    FOR UPDATE USING (
        auth.uid() = patient_id OR auth.uid() = doctor_id
    );

CREATE POLICY "Users can delete own appointments" ON public.appointments
    FOR DELETE USING (auth.uid() = patient_id);

-- 14. Create policies for healthcare providers
CREATE POLICY "Healthcare providers can view all data" ON public.appointments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public."User"
            WHERE id = auth.uid()
            AND role IN ('doctor', 'nurse', 'admin')
        )
    );

-- 15. Create updated_at trigger function
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 16. Add updated_at triggers to all tables
CREATE TRIGGER set_timestamp_user
    BEFORE UPDATE ON public."User"
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_patients
    BEFORE UPDATE ON public.patients
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_appointments
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_timestamp();

-- Add similar triggers for other tables...

-- 17. Create indexes for better performance
CREATE INDEX idx_patients_patient_id ON public.patients(patient_id);
CREATE INDEX idx_appointments_patient_id ON public.appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON public.appointments(doctor_id);
CREATE INDEX idx_appointments_date ON public.appointments(date);

-- 18. Insert sample data for testing
-- Note: Replace the UUIDs with actual user IDs after creating users

-- Sample pharmacy inventory
INSERT INTO public.pharmacy_inventory (medicine_name, quantity, batch_number, expiry_date, unit_price)
VALUES
    ('Paracetamol 500mg', 1000, 'BATCH001', '2025-12-31', 5.50),
    ('Amoxicillin 250mg', 500, 'BATCH002', '2025-06-30', 12.75),
    ('Ibuprofen 400mg', 750, 'BATCH003', '2025-09-30', 8.25)
ON CONFLICT DO NOTHING;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'Tables created: User, patients, appointments, pharmacy_inventory, etc.';
    RAISE NOTICE 'RLS policies applied for secure data access';
    RAISE NOTICE 'Ready for mobile app connection';
END $$;