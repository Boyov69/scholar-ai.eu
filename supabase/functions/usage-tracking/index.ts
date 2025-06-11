import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the JWT token
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid authentication token')
    }

    if (req.method === 'GET') {
      // Get usage data for the user
      const url = new URL(req.url)
      const period = url.searchParams.get('period') || 'current'
      
      let startDate, endDate
      const now = new Date()
      
      switch (period) {
        case 'current':
          // Current billing period (this month)
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
          break
        case 'last_month':
          startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
          endDate = new Date(now.getFullYear(), now.getMonth(), 0)
          break
        case 'last_3_months':
          startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
          endDate = now
          break
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      }

      // Get or create usage record for the period
      let { data: usage, error: usageError } = await supabaseClient
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('period_start', startDate.toISOString().split('T')[0])
        .single()

      if (usageError && usageError.code === 'PGRST116') {
        // No usage record exists, create one
        const { data: newUsage, error: createError } = await supabaseClient
          .from('usage_tracking')
          .insert({
            user_id: user.id,
            period_start: startDate.toISOString(),
            period_end: endDate.toISOString(),
            queries_used: 0,
            collaborators_count: 0,
            storage_used_mb: 0,
            workspaces_count: 0,
            citations_count: 0
          })
          .select()
          .single()

        if (createError) {
          throw createError
        }
        usage = newUsage
      } else if (usageError) {
        throw usageError
      }

      // Get real-time counts
      const [queriesResult, workspacesResult, citationsResult] = await Promise.all([
        // Count research queries in the period
        supabaseClient
          .from('research_queries')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Count workspaces
        supabaseClient
          .from('workspaces')
          .select('id', { count: 'exact' })
          .eq('owner_id', user.id),
        
        // Count citations in the period
        supabaseClient
          .from('citations')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      ])

      // Update usage with real-time data
      const updatedUsage = {
        ...usage,
        queries_used: queriesResult.count || 0,
        workspaces_count: workspacesResult.count || 0,
        citations_count: citationsResult.count || 0
      }

      // Update the database with current counts
      await supabaseClient
        .from('usage_tracking')
        .update({
          queries_used: updatedUsage.queries_used,
          workspaces_count: updatedUsage.workspaces_count,
          citations_count: updatedUsage.citations_count,
          updated_at: new Date().toISOString()
        })
        .eq('id', usage.id)

      return new Response(
        JSON.stringify(updatedUsage),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )

    } else if (req.method === 'POST') {
      // Update usage data
      const { action, amount = 1 } = await req.json()

      if (!action) {
        throw new Error('Action is required')
      }

      // Get current period
      const now = new Date()
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0)

      // Get or create usage record
      let { data: usage, error: usageError } = await supabaseClient
        .from('usage_tracking')
        .select('*')
        .eq('user_id', user.id)
        .eq('period_start', startDate.toISOString().split('T')[0])
        .single()

      if (usageError && usageError.code === 'PGRST116') {
        // Create new usage record
        const { data: newUsage, error: createError } = await supabaseClient
          .from('usage_tracking')
          .insert({
            user_id: user.id,
            period_start: startDate.toISOString(),
            period_end: endDate.toISOString(),
            queries_used: 0,
            collaborators_count: 0,
            storage_used_mb: 0,
            workspaces_count: 0,
            citations_count: 0
          })
          .select()
          .single()

        if (createError) {
          throw createError
        }
        usage = newUsage
      } else if (usageError) {
        throw usageError
      }

      // Update based on action
      let updateData = {}
      switch (action) {
        case 'query':
          updateData = { queries_used: usage.queries_used + amount }
          break
        case 'storage':
          updateData = { storage_used_mb: usage.storage_used_mb + amount }
          break
        case 'workspace':
          updateData = { workspaces_count: usage.workspaces_count + amount }
          break
        case 'citation':
          updateData = { citations_count: usage.citations_count + amount }
          break
        case 'collaborator':
          updateData = { collaborators_count: usage.collaborators_count + amount }
          break
        default:
          throw new Error(`Unknown action: ${action}`)
      }

      updateData.updated_at = new Date().toISOString()

      // Update usage
      const { data: updatedUsage, error: updateError } = await supabaseClient
        .from('usage_tracking')
        .update(updateData)
        .eq('id', usage.id)
        .select()
        .single()

      if (updateError) {
        throw updateError
      }

      return new Response(
        JSON.stringify(updatedUsage),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    throw new Error('Method not allowed')

  } catch (error) {
    console.error('Usage tracking error:', error)
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: error.message || 'Internal server error' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
