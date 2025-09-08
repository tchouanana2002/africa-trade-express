-- Create orders table to track Campay payments
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  campay_reference TEXT UNIQUE,
  campay_payment_url TEXT,
  amount INTEGER NOT NULL,             -- Amount in XAF (no decimals for XAF)
  currency TEXT DEFAULT 'XAF',
  status TEXT DEFAULT 'pending',       -- 'pending', 'paid', 'failed', 'cancelled'
  items JSONB,                         -- Store cart items as JSON
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create policies for orders table
CREATE POLICY "Users can view their own orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow edge functions to insert and update orders (using service role key)
CREATE POLICY "Edge functions can insert orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Edge functions can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

-- Add trigger for updating the updated_at column
CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();