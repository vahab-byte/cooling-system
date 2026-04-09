-- Razorpay Payment Integration Migration
-- Creating the infrastructure for real-time transaction tracking

-- 1. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method TEXT, -- 'upi', 'card', 'qr', etc.
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    transaction_id TEXT UNIQUE, -- Razorpay Payment ID (razorpay_payment_id)
    razorpay_order_id TEXT, -- Razorpay Order ID (razorpay_order_id)
    razorpay_signature TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. ADD TRIGGER FOR UPDATED_AT
CREATE TRIGGER set_payments_updated_at 
    BEFORE UPDATE ON public.payments 
    FOR EACH ROW 
    EXECUTE FUNCTION handle_updated_at();

-- 3. ENSURE BOOKINGS HAS FAILED STATUS IN CHECK (OPTIONAL ENHANCEMENT)
-- The current schema has 'unpaid', 'paid', 'refunded'. 
-- We'll keep it as is for now to avoid migration complexity.

-- 4. ENABLE RLS (OPTIONAL BUT RECOMMENDED)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own payments through the bookings join
CREATE POLICY "Users can view their own payments" 
    ON public.payments 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.bookings 
            WHERE public.bookings.id = public.payments.booking_id 
            AND public.bookings.user_id = auth.uid()
        )
    );
