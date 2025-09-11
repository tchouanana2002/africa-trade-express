-- Create products table for vendor product management
CREATE TABLE public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  vendor_id UUID NOT NULL,
  category TEXT,
  stock INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Anyone can view active products" 
ON public.products 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Vendors can view their own products" 
ON public.products 
FOR SELECT 
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can create their own products" 
ON public.products 
FOR INSERT 
WITH CHECK (auth.uid() = vendor_id);

CREATE POLICY "Vendors can update their own products" 
ON public.products 
FOR UPDATE 
USING (auth.uid() = vendor_id);

CREATE POLICY "Vendors can delete their own products" 
ON public.products 
FOR DELETE 
USING (auth.uid() = vendor_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_products_vendor_id ON public.products(vendor_id);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_active ON public.products(is_active);

-- Update orders table to include vendor_id for better vendor order management
ALTER TABLE public.orders ADD COLUMN vendor_id UUID;

-- Create index for vendor orders
CREATE INDEX idx_orders_vendor_id ON public.orders(vendor_id);

-- Create policy for vendors to view their orders
CREATE POLICY "Vendors can view their orders" 
ON public.orders 
FOR SELECT 
USING (auth.uid() = vendor_id);