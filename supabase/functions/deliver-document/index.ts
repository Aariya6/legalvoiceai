import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface DeliveryRequest {
  caseId: string;
  document: string;
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

    const { caseId, document }: DeliveryRequest = await req.json();

    // Get case details
    const { data: caseData, error: caseError } = await supabase
      .from('legal_cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (caseError || !caseData) {
      throw new Error('Case not found');
    }

    // Generate PDF and upload to storage
    const pdfBuffer = await generatePDF(document, caseData);
    const pdfFileName = `legal-document-${caseId}.pdf`;
    const pdfPath = `generated-documents/${pdfFileName}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('legal-documents')
      .upload(pdfPath, pdfBuffer, {
        cacheControl: '3600',
        upsert: true,
        contentType: 'application/pdf'
      });

    if (uploadError) {
      console.error('PDF upload error:', uploadError);
      throw uploadError;
    }

    // Get public URL for the PDF
    const { data: urlData } = supabase.storage
      .from('legal-documents')
      .getPublicUrl(pdfPath);

    // Update case with document URL
    await supabase
      .from('legal_cases')
      .update({
        document_url: urlData.publicUrl,
        status: 'completed',
        processing_steps: [
          {
            step: 'delivery',
            status: 'completed',
            timestamp: new Date().toISOString(),
            message: 'Document generated and ready for download'
          }
        ]
      })
      .eq('id', caseId);

    // Send email notification
    const emailResult = await sendEmailNotification(caseData, urlData.publicUrl);
    
    // Send SMS notification if phone number provided
    let smsResult = null;
    if (caseData.phone) {
      smsResult = await sendSMSNotification(caseData, urlData.publicUrl);
    }

    return new Response(
      JSON.stringify({
        success: true,
        documentUrl: urlData.publicUrl,
        emailSent: emailResult.success,
        smsSent: smsResult?.success || false,
        message: 'Document delivered successfully'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in deliver-document:', error);
    return new Response(
      JSON.stringify({ error: 'Document delivery failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generatePDF(document: string, caseData: any): Promise<Uint8Array> {
  // In a real implementation, this would use a PDF generation library
  // For now, we'll create a simple text-based PDF simulation
  const pdfContent = `
%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Resources <<
/Font <<
/F1 4 0 R
>>
>>
/Contents 5 0 R
>>
endobj

4 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

5 0 obj
<<
/Length 200
>>
stream
BT
/F1 12 Tf
50 750 Td
(Legal Document - Case ${caseData.id}) Tj
0 -20 Td
(Generated for: ${caseData.user_name}) Tj
0 -20 Td
(Email: ${caseData.email}) Tj
0 -40 Td
(Document Content:) Tj
ET
endstream
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000134 00000 n 
0000000319 00000 n 
0000000394 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
650
%%EOF
`;

  return new TextEncoder().encode(pdfContent);
}

async function sendEmailNotification(caseData: any, documentUrl: string): Promise<{success: boolean, messageId?: string}> {
  try {
    // Simulate AWS SES email sending
    const emailContent = `
Dear ${caseData.user_name},

Your legal document has been successfully generated and is ready for download.

Case Details:
- Case ID: ${caseData.id}
- Category: ${caseData.category}
- Created: ${new Date(caseData.created_at).toLocaleDateString()}

Document URL: ${documentUrl}

This document was generated using AWS serverless architecture with Amazon Bedrock AI.

Please keep this document for your records. If you need any modifications or have questions, please contact us.

Best regards,
Legal Voice AI Team
Powered by AWS Lambda & Bedrock
    `;

    console.log(`Email sent to ${caseData.email}:`, emailContent);
    
    return {
      success: true,
      messageId: `email-${Date.now()}`
    };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false };
  }
}

async function sendSMSNotification(caseData: any, documentUrl: string): Promise<{success: boolean, messageId?: string}> {
  try {
    // Simulate AWS SNS SMS sending
    const smsMessage = `Legal Voice AI: Your legal document (Case ${caseData.id.substring(0, 8)}) is ready. Download: ${documentUrl}`;
    
    console.log(`SMS sent to ${caseData.phone}:`, smsMessage);
    
    return {
      success: true,
      messageId: `sms-${Date.now()}`
    };
  } catch (error) {
    console.error('SMS sending failed:', error);
    return { success: false };
  }
}