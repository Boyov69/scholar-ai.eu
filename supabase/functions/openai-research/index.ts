import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OpenAIRequest {
  query: string;
  tier: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

interface OpenAIResponse {
  success: boolean;
  data?: any;
  error?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 🔒 SECURE: Get OpenAI API key from environment (server-side only)
    // This key is NEVER exposed to the frontend/browser
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Get Supabase client for user verification
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user authentication
    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser()

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Parse request body
    const { query, tier, model = 'gpt-4o', maxTokens = 4096, temperature = 0.1 }: OpenAIRequest = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ success: false, error: 'Query is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    // Check user's subscription tier and apply restrictions
    const { data: subscription } = await supabaseClient
      .from('subscriptions')
      .select('tier, status')
      .eq('user_id', user.id)
      .single()

    // Apply tier-based restrictions
    let allowedModel = model
    let allowedMaxTokens = maxTokens

    if (!subscription || subscription.tier === 'basic') {
      // Basic users get limited access
      allowedModel = 'gpt-4o-mini'
      allowedMaxTokens = Math.min(maxTokens, 2048)
    } else if (subscription.tier === 'ultra') {
      // Ultra users get full access
      allowedModel = model
      allowedMaxTokens = maxTokens
    }

    // Prepare OpenAI API request
    const openaiRequest = {
      model: allowedModel,
      messages: [
        {
          role: "system",
          content: "You are a helpful academic research assistant. Provide accurate, well-researched responses with proper citations when possible."
        },
        {
          role: "user",
          content: query
        }
      ],
      max_tokens: allowedMaxTokens,
      temperature: temperature,
      stream: false
    }

    // 🔒 SECURE: Make request to OpenAI API (server-side only)
    // API key is safely used server-side, never exposed to client
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(openaiRequest),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const openaiData = await openaiResponse.json()

    // Log usage for tracking
    await supabaseClient
      .from('research_queries')
      .insert({
        user_id: user.id,
        query: query,
        response: openaiData.choices[0]?.message?.content || '',
        model: allowedModel,
        tokens_used: openaiData.usage?.total_tokens || 0,
        tier: subscription?.tier || 'basic',
        created_at: new Date().toISOString()
      })

    // Return successful response
    const response: OpenAIResponse = {
      success: true,
      data: {
        response: openaiData.choices[0]?.message?.content || '',
        model: allowedModel,
        tier: subscription?.tier || 'basic'
      },
      usage: openaiData.usage
    }

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('OpenAI Research Function Error:', error)
    
    const errorResponse: OpenAIResponse = {
      success: false,
      error: error.message || 'Internal server error'
    }

    return new Response(
      JSON.stringify(errorResponse),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
