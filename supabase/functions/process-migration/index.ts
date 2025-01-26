import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { parse } from 'https://deno.land/std@0.181.0/csv/mod.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { migrationId } = await req.json()

    // Get migration job details
    const { data: migrationJob, error: jobError } = await supabase
      .from('migration_jobs')
      .select('*')
      .eq('id', migrationId)
      .single()

    if (jobError || !migrationJob) {
      throw new Error('Migration job not found')
    }

    // Update status to processing
    await supabase
      .from('migration_jobs')
      .update({ 
        status: 'processing',
        started_at: new Date().toISOString()
      })
      .eq('id', migrationId)

    // Download the CSV file
    const { data: fileData, error: downloadError } = await supabase
      .storage
      .from('migrations')
      .download(migrationJob.filename)

    if (downloadError) {
      throw new Error('Failed to download CSV file')
    }

    // Parse CSV content with error handling
    const csvContent = await fileData.text()
    let records
    try {
      records = parse(csvContent, {
        skipFirstRow: true,
        columns: true,
        relaxColumnCount: true, // Allow varying number of fields
        ignoreEmpty: true
      })
    } catch (parseError) {
      console.error('CSV parsing error:', parseError)
      await supabase
        .from('migration_jobs')
        .update({ 
          status: 'failed',
          error_log: [{ error: `CSV parsing error: ${parseError.message}` }],
          completed_at: new Date().toISOString()
        })
        .eq('id', migrationId)
      throw parseError
    }

    // Process in chunks of 500
    const chunkSize = 500
    const chunks = []
    for (let i = 0; i < records.length; i += chunkSize) {
      chunks.push(records.slice(i, i + chunkSize))
    }

    const errorLog = []
    let processedCount = 0
    let failedCount = 0

    // Update total records count
    await supabase
      .from('migration_jobs')
      .update({ total_records: records.length })
      .eq('id', migrationId)

    // Process each chunk
    for (const chunk of chunks) {
      const { error: insertError } = await supabase
        .from('leads')
        .insert(chunk)

      if (insertError) {
        failedCount += chunk.length
        errorLog.push({
          chunk_start: processedCount,
          error: insertError.message
        })
      } else {
        processedCount += chunk.length
      }

      // Update progress
      await supabase
        .from('migration_jobs')
        .update({ 
          processed_records: processedCount,
          failed_records: failedCount,
          error_log: errorLog
        })
        .eq('id', migrationId)
    }

    // Mark as completed
    await supabase
      .from('migration_jobs')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', migrationId)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Migration processing error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})