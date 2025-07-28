-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  preferred_time TIMESTAMP WITH TIME ZONE NOT NULL,
  call_type TEXT NOT NULL CHECK (call_type IN ('video', 'voice')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert bookings (for patient booking form)
CREATE POLICY "Anyone can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (true);

-- Create policy to allow authenticated users to read all bookings (for admin dashboard)
CREATE POLICY "Authenticated users can view all bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update bookings (for admin dashboard)
CREATE POLICY "Authenticated users can update bookings" 
ON public.bookings 
FOR UPDATE 
USING (auth.role() = 'authenticated');