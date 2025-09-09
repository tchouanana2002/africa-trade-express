-- Add blocked status to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT false;

-- Create analytics tables
CREATE TABLE IF NOT EXISTS public.app_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL,
  date DATE NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on analytics
ALTER TABLE public.app_analytics ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to access analytics
CREATE POLICY "Admins can access analytics" 
ON public.app_analytics 
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Create app settings table
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on settings
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage settings
CREATE POLICY "Admins can manage settings" 
ON public.app_settings 
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Insert default settings
INSERT INTO public.app_settings (setting_key, setting_value, description)
VALUES 
  ('app_name', '"Marketplace"', 'Application name'),
  ('maintenance_mode', 'false', 'Enable/disable maintenance mode'),
  ('max_order_amount', '1000000', 'Maximum order amount in XAF'),
  ('default_currency', '"XAF"', 'Default currency for orders')
ON CONFLICT (setting_key) DO NOTHING;

-- Create trigger for updated_at on app_settings
CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();