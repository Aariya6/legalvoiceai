import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface TranscribeRequest {
  caseId: string;
  audioUrl: string;
  language: string;
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

    const { caseId, audioUrl, language }: TranscribeRequest = await req.json();

    // Update case status to transcribing
    await supabase
      .from('legal_cases')
      .update({
        status: 'transcribing',
        processing_steps: [
          {
            step: 'transcribing',
            status: 'in_progress',
            timestamp: new Date().toISOString(),
            message: 'Starting transcription with AWS Transcribe'
          }
        ]
      })
      .eq('id', caseId);

    // Simulate AWS Transcribe processing with realistic delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock transcription results based on common legal scenarios
    const mockTranscriptions = [
      {
        transcript: "I am writing to formally request the return of my security deposit in the amount of $1,200 from the rental property located at 123 Main Street. I vacated the premises on December 15th, 2023, and left the property in excellent condition. Despite multiple attempts to contact the landlord, I have not received my deposit back within the required 30-day period. I have photos and documentation showing the property was left in pristine condition.",
        confidence: 0.94
      },
      {
        transcript: "I am filing a complaint against my former employer ABC Corporation for wage theft. They have failed to pay me for overtime hours worked during the months of October and November 2023. I worked approximately 60 hours per week but was only paid for 40 hours. The total amount owed is approximately $2,400 in unpaid overtime wages. I have documentation of all hours worked including time sheets and have attempted to resolve this matter directly with HR without success.",
        confidence: 0.92
      },
      {
        transcript: "I need to file a formal complaint about loan recovery. I lent $5,000 to John Smith on March 15th, 2023, with a written agreement that it would be repaid within 6 months. The loan was due on September 15th, 2023, but I have not received any payment despite multiple requests. I have the signed loan agreement and bank transfer records showing the money was transferred to his account. He has been avoiding my calls and messages.",
        confidence: 0.96
      }
    ];

    const transcriptionResult = mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];

    // Update case with transcription
    const { error: updateError } = await supabase
      .from('legal_cases')
      .update({
        transcription: transcriptionResult.transcript,
        status: 'generating',
        processing_steps: [
          {
            step: 'transcription',
            status: 'completed',
            timestamp: new Date().toISOString(),
            message: `Transcription completed with ${(transcriptionResult.confidence * 100).toFixed(1)}% confidence`
          }
        ]
      })
      .eq('id', caseId);

    if (updateError) {
      throw updateError;
    }

    // Trigger document generation
    const generateResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/generate-document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caseId: caseId,
        transcript: transcriptionResult.transcript
      })
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Transcription completed, document generation started'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in transcribe-handler:', error);
    return new Response(
      JSON.stringify({ error: 'Transcription failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});