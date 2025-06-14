
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, password, action } = await req.json()

    if (action === 'login') {
      // Verify admin credentials
      const { data: adminUser, error } = await supabaseClient
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single()

      if (error || !adminUser) {
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }

      // For simplicity, we'll compare plain text passwords
      // In production, you should hash passwords
      if (adminUser.password_hash === password) {
        return new Response(
          JSON.stringify({ success: true, admin: { email: adminUser.email } }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } else {
        return new Response(
          JSON.stringify({ error: 'Invalid credentials' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
        )
      }
    }

    if (action === 'create') {
      // Create new admin user
      const { error } = await supabaseClient
        .from('admin_users')
        .insert({
          email,
          password_hash: password, // In production, hash this
          is_active: true
        })

      if (error) {
        return new Response(
          JSON.stringify({ error: 'Failed to create admin user' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Admin user created' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
