import { createClient } from 'npm:@supabase/supabase-js@2';
import { v4 as uuidv4 } from 'npm:uuid@9';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface CaseData {
  name: string;
  email: string;
  phone?: string;
  category: string;
  language: string;
  method: 'record' | 'upload';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const caseDataStr = formData.get('caseData') as string;
    const caseData: CaseData = JSON.parse(caseDataStr);

    if (!audioFile || !caseData) {
      return new Response(
        JSON.stringify({ error: 'Missing audio file or case data' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique filename
    const fileExtension = audioFile.name.split('.').pop() || 'wav';
    const fileName = `${uuidv4()}.${fileExtension}`;
    const filePath = `audio-uploads/${fileName}`;

    // Upload audio file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('legal-documents')
      .upload(filePath, audioFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return new Response(
        JSON.stringify({ error: 'Failed to upload audio file' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get public URL for the uploaded file
    const { data: urlData } = supabase.storage
      .from('legal-documents')
      .getPublicUrl(filePath);

    // Create case record in database
    const { data: caseRecord, error: dbError } = await supabase
      .from('legal_cases')
      .insert({
        user_name: caseData.name,
        email: caseData.email,
        phone: caseData.phone,
        category: caseData.category,
        language: caseData.language,
        method: caseData.method,
        status: 'processing',
        audio_file_url: urlData.publicUrl,
        processing_steps: [
          {
            step: 'upload',
            status: 'completed',
            timestamp: new Date().toISOString(),
            message: 'Audio file uploaded successfully'
          }
        ]
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to create case record' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Trigger transcription process
    const transcribeResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/transcribe-handler`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caseId: caseRecord.id,
        audioUrl: urlData.publicUrl,
        language: caseData.language
      })
    });

    return new Response(
      JSON.stringify({
        success: true,
        caseId: caseRecord.id,
        message: 'Case created successfully and processing started'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in upload-handler:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});