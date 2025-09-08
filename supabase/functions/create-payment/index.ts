import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CampayPaymentRequest {
  items: Array<{
    id: string;
    name: string;
    price: string;
    quantity: number;
    vendor: string;
    image: string;
  }>;
  totalAmount: number;
  currency: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing Campay payment request...');

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    // Get authenticated user
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      console.error('User not authenticated');
      return new Response(
        JSON.stringify({ error: 'User not authenticated' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Parse request body
    const { items, totalAmount, currency }: CampayPaymentRequest = await req.json();

    console.log(`Creating payment for user ${user.id}, amount: ${totalAmount} ${currency}`);

    // Get Campay credentials from secrets
    const CAMPAY_USERNAME = Deno.env.get('CAMPAY_USERNAME');
    const CAMPAY_PASSWORD = Deno.env.get('CAMPAY_PASSWORD');
    const CAMPAY_APP_ID = Deno.env.get('CAMPAY_APP_ID');

    if (!CAMPAY_USERNAME || !CAMPAY_PASSWORD || !CAMPAY_APP_ID) {
      console.error('Missing Campay credentials');
      return new Response(
        JSON.stringify({ error: 'Payment service configuration error' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Get Campay access token
    const tokenResponse = await fetch('https://campay.net/api/token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: CAMPAY_USERNAME,
        password: CAMPAY_PASSWORD,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to get Campay token:', await tokenResponse.text());
      throw new Error('Failed to authenticate with payment service');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.token;

    console.log('Successfully obtained Campay access token');

    // Generate a unique external reference
    const externalReference = `order_${user.id}_${Date.now()}`;

    // Create payment request
    const paymentData = {
      amount: totalAmount.toString(),
      currency: currency,
      external_reference: externalReference,
      phone_number: '237000000000', // You might want to get this from user profile
      description: `AfriMarket Order - ${items.length} items`,
      redirect_url: `${req.headers.get('origin')}/payment-success`,
      webhook_url: `${req.headers.get('origin')}/api/webhooks/campay`, // Optional webhook
    };

    console.log('Creating Campay payment with data:', paymentData);

    const paymentResponse = await fetch('https://campay.net/api/collect/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData),
    });

    if (!paymentResponse.ok) {
      const errorText = await paymentResponse.text();
      console.error('Campay payment creation failed:', errorText);
      throw new Error('Failed to create payment');
    }

    const paymentResult = await paymentResponse.json();
    console.log('Campay payment created successfully:', paymentResult);

    // Store order in database using service role key
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Create order record
    const { error: orderError } = await supabaseService
      .from('orders')
      .insert({
        user_id: user.id,
        campay_reference: externalReference,
        campay_payment_url: paymentResult.link,
        amount: totalAmount,
        currency: currency,
        status: 'pending',
        items: items,
      });

    if (orderError) {
      console.error('Failed to store order:', orderError);
      // Don't fail the payment creation, just log the error
    }

    return new Response(
      JSON.stringify({ 
        url: paymentResult.link,
        reference: externalReference 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Payment creation error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});