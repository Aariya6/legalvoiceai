import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

interface GenerateRequest {
  caseId: string;
  transcript: string;
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

    const { caseId, transcript }: GenerateRequest = await req.json();

    // Get case details
    const { data: caseData, error: caseError } = await supabase
      .from('legal_cases')
      .select('*')
      .eq('id', caseId)
      .single();

    if (caseError || !caseData) {
      throw new Error('Case not found');
    }

    // Update status to generating
    await supabase
      .from('legal_cases')
      .update({
        status: 'generating',
        processing_steps: [
          {
            step: 'generating',
            status: 'in_progress',
            timestamp: new Date().toISOString(),
            message: 'Generating legal document with Amazon Bedrock AI'
          }
        ]
      })
      .eq('id', caseId);

    // Simulate Amazon Bedrock processing
    await new Promise(resolve => setTimeout(resolve, 4000));

    // Get template for the category
    const { data: template } = await supabase
      .from('document_templates')
      .select('*')
      .eq('category', caseData.category)
      .eq('language', caseData.language)
      .single();

    // Generate document using AI (simulated)
    const generatedDocument = await generateLegalDocument(
      transcript,
      caseData.category,
      caseData.user_name,
      caseData.email,
      template?.template_content
    );

    // Update case with generated document
    const { error: updateError } = await supabase
      .from('legal_cases')
      .update({
        generated_document: generatedDocument,
        status: 'completed',
        processing_steps: [
          {
            step: 'generation',
            status: 'completed',
            timestamp: new Date().toISOString(),
            message: 'Legal document generated successfully'
          }
        ]
      })
      .eq('id', caseId);

    if (updateError) {
      throw updateError;
    }

    // Trigger delivery process
    const deliveryResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/deliver-document`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        caseId: caseId,
        document: generatedDocument
      })
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Document generated successfully, starting delivery'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-document:', error);
    return new Response(
      JSON.stringify({ error: 'Document generation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

async function generateLegalDocument(
  transcript: string,
  category: string,
  userName: string,
  userEmail: string,
  template?: string
): Promise<string> {
  // Simulate Amazon Bedrock Claude API call
  const prompt = `
You are a professional legal assistant. Based on the following user complaint, generate a formal legal document.

User Information:
- Name: ${userName}
- Email: ${userEmail}

Complaint Category: ${category}
User's Statement: "${transcript}"

Generate appropriate legal language based on the category. Use formal legal terminology and structure.
Include proper formatting with headers, sections, and professional language.
Add placeholders for specific details that need to be customized.

${template ? `Use this template as a guide: ${template}` : ''}

Generate a professional legal document that addresses the user's concerns.
`;

  // This would be a real Amazon Bedrock API call in production
  // For now, return a sophisticated mock response
  
  const documentMappings: Record<string, string> = {
    'Property Dispute': generatePropertyDispute(transcript, userName),
    'Wage Theft': generateWageTheftComplaint(transcript, userName),
    'Loan Recovery': generateLoanRecovery(transcript, userName),
    'Harassment': generateHarassmentComplaint(transcript, userName),
    'Contract Dispute': generateContractDispute(transcript, userName),
    'Domestic Abuse': generateDomesticAbuseDocument(transcript, userName)
  };

  return documentMappings[category] || generateGenericLegalDocument(transcript, userName, category);
}

function generatePropertyDispute(transcript: string, userName: string): string {
  const currentDate = new Date().toLocaleDateString();
  return `
FORMAL NOTICE - PROPERTY DISPUTE RESOLUTION

TO: [LANDLORD/PROPERTY OWNER NAME]
FROM: ${userName}
DATE: ${currentDate}
RE: PROPERTY DISPUTE - [PROPERTY ADDRESS]

Dear [LANDLORD/PROPERTY OWNER NAME],

This letter serves as formal notice regarding a property dispute that requires immediate attention and resolution.

BACKGROUND:
Based on the details provided: "${transcript.substring(0, 200)}..."

LEGAL GROUNDS:
Under applicable landlord-tenant laws and property regulations, I am entitled to:
- Fair treatment and proper maintenance of the property
- Return of security deposits within statutory timeframes
- Proper notice for any changes to tenancy terms
- Habitable living conditions as per health and safety codes

DEMAND FOR RESOLUTION:
I hereby formally request that you:
1. Address the issues mentioned above within 30 days
2. Provide written confirmation of corrective actions taken
3. Compensate for any damages or losses incurred

LEGAL CONSEQUENCES:
Failure to respond appropriately may result in:
- Filing a complaint with local housing authorities
- Pursuing legal action for damages
- Reporting violations to relevant regulatory bodies
- Seeking attorney fees and court costs

I prefer to resolve this matter amicably and professionally. Please contact me within 10 business days to discuss a resolution.

Sincerely,
${userName}
[Your Address]
[Your Phone Number]
[Your Email Address]

Date: ${currentDate}
`;
}

function generateWageTheftComplaint(transcript: string, userName: string): string {
  const currentDate = new Date().toLocaleDateString();
  return `
FORMAL COMPLAINT - WAGE AND HOUR VIOLATIONS

TO: [EMPLOYER NAME]
FROM: ${userName}
DATE: ${currentDate}
RE: UNPAID WAGES AND LABOR LAW VIOLATIONS

Dear [EMPLOYER NAME],

This letter serves as formal notice of wage and hour violations under federal and state labor laws.

VIOLATION DETAILS:
Based on my employment records: "${transcript.substring(0, 200)}..."

LEGAL REQUIREMENTS:
Under the Fair Labor Standards Act (FLSA) and applicable state labor laws:
- All hours worked must be compensated at agreed rates
- Overtime must be paid at 1.5x regular rate for hours over 40/week
- Final paychecks must be issued within statutory timeframes
- Wage statements must accurately reflect hours and compensation

DEMAND FOR PAYMENT:
I hereby demand:
1. Payment of all unpaid wages: $[AMOUNT]
2. Overtime compensation: $[AMOUNT]
3. Interest and penalties as allowed by law
4. Full accounting of all deductions taken

TIMEFRAME:
You have 30 days from receipt of this letter to remit full payment.

LEGAL ACTION:
Failure to comply will result in:
- Filing complaints with the Department of Labor
- Pursuing civil litigation for unpaid wages
- Seeking liquidated damages and attorney fees
- Reporting violations to state labor authorities

Please contact me immediately to arrange payment.

Sincerely,
${userName}
[Your Address]
[Your Phone Number]
[Your Email Address]

Date: ${currentDate}
`;
}

function generateLoanRecovery(transcript: string, userName: string): string {
  const currentDate = new Date().toLocaleDateString();
  return `
FORMAL DEMAND LETTER - LOAN RECOVERY

TO: [BORROWER NAME]
FROM: ${userName}
DATE: ${currentDate}
RE: OUTSTANDING LOAN OBLIGATION

Dear [BORROWER NAME],

This letter constitutes formal demand for immediate payment of the outstanding loan balance.

LOAN DETAILS:
As evidenced by our agreement: "${transcript.substring(0, 200)}..."

CURRENT STATUS:
- Original Loan Amount: $[AMOUNT]
- Current Balance Due: $[AMOUNT]
- Days Past Due: [NUMBER]
- Last Payment Received: [DATE]

LEGAL DEMAND:
You are hereby formally demanded to pay the full outstanding balance of $[AMOUNT] within thirty (30) days of receipt of this letter.

DOCUMENTATION:
I have maintained complete records including:
- Original loan agreement
- Payment history
- Communications regarding the debt
- Banking records of the loan disbursement

CONSEQUENCES OF NON-PAYMENT:
Failure to remit payment within the specified timeframe will result in:
- Acceleration of the entire debt amount
- Legal action to recover principal, interest, and costs
- Potential impact on your credit rating
- Collection of attorney fees and court costs
- Garnishment of wages or assets if judgment is obtained

RESOLUTION:
I prefer to resolve this matter without litigation. Please contact me immediately to arrange payment or discuss a payment plan.

This is a formal attempt to collect a debt. Any information obtained will be used for that purpose.

Sincerely,
${userName}
[Your Address]
[Your Phone Number]
[Your Email Address]

Date: ${currentDate}
`;
}

function generateHarassmentComplaint(transcript: string, userName: string): string {
  const currentDate = new Date().toLocaleDateString();
  return `
FORMAL COMPLAINT - HARASSMENT AND INTIMIDATION

TO: [RESPONDENT NAME/ORGANIZATION]
FROM: ${userName}
DATE: ${currentDate}
RE: HARASSMENT COMPLAINT AND DEMAND FOR CESSATION

Dear [RESPONDENT NAME],

This letter serves as formal notice that your conduct constitutes harassment and must cease immediately.

HARASSMENT DETAILS:
The following incidents have occurred: "${transcript.substring(0, 200)}..."

LEGAL STANDARDS:
Your conduct violates:
- Anti-harassment statutes
- Civil rights protections
- Disturbing the peace ordinances
- Potential criminal statutes

EVIDENCE:
I have documented evidence including:
- Dates and times of incidents
- Witness statements
- Photos or recordings where applicable
- Police reports (if filed)

IMMEDIATE DEMANDS:
1. Cease all harassing behavior immediately
2. Maintain a respectful distance
3. Refrain from any contact or communication
4. Respect my right to peaceful enjoyment of my property/workplace

LEGAL CONSEQUENCES:
Continued harassment will result in:
- Filing for a restraining order/protection order
- Criminal complaints to law enforcement
- Civil lawsuit for damages and injunctive relief
- Seeking attorney fees and court costs

DOCUMENTATION:
This letter serves as formal notice and will be filed with relevant authorities.

I expect your immediate compliance with this demand.

Sincerely,
${userName}
[Your Address]
[Your Phone Number]
[Your Email Address]

Date: ${currentDate}
`;
}

function generateContractDispute(transcript: string, userName: string): string {
  const currentDate = new Date().toLocaleDateString();
  return `
FORMAL NOTICE - CONTRACT DISPUTE

TO: [CONTRACTING PARTY NAME]
FROM: ${userName}
DATE: ${currentDate}
RE: BREACH OF CONTRACT - [CONTRACT DESCRIPTION]

Dear [CONTRACTING PARTY NAME],

This letter serves as formal notice of breach of contract and demand for performance.

CONTRACT DETAILS:
Regarding our agreement: "${transcript.substring(0, 200)}..."

BREACH ALLEGATIONS:
You have failed to perform the following contractual obligations:
- [SPECIFIC BREACH 1]
- [SPECIFIC BREACH 2]
- [SPECIFIC BREACH 3]

LEGAL GROUNDS:
Under the terms of our contract dated [DATE], you agreed to [OBLIGATIONS].
Your failure to perform constitutes a material breach of contract.

DEMAND FOR PERFORMANCE:
I hereby demand that you:
1. Cure the breach within 30 days
2. Perform all outstanding obligations
3. Compensate for damages incurred due to the breach

DAMAGES:
As a result of your breach, I have suffered:
- Direct damages: $[AMOUNT]
- Consequential damages: $[AMOUNT]
- Additional costs: $[AMOUNT]

REMEDIES:
If you fail to cure this breach, I will pursue all available legal remedies including:
- Termination of the contract
- Lawsuit for damages and specific performance
- Recovery of attorney fees and costs
- Any other relief deemed appropriate by the court

Please contact me immediately to discuss resolution of this matter.

Sincerely,
${userName}
[Your Address]
[Your Phone Number]
[Your Email Address]

Date: ${currentDate}
`;
}

function generateDomesticAbuseDocument(transcript: string, userName: string): string {
  const currentDate = new Date().toLocaleDateString();
  return `
**CONFIDENTIAL LEGAL DOCUMENT**
DOMESTIC ABUSE DOCUMENTATION AND SAFETY PLAN

PREPARED FOR: ${userName}
DATE: ${currentDate}
CASE REFERENCE: [CASE NUMBER]

INCIDENT DOCUMENTATION:
Based on the reported information: "${transcript.substring(0, 150)}..."

IMMEDIATE SAFETY RECOMMENDATIONS:
1. Contact local law enforcement if in immediate danger (911)
2. Reach out to domestic violence hotline: 1-800-799-7233
3. Consider temporary protection order/restraining order
4. Document all incidents with dates, times, and evidence

LEGAL OPTIONS AVAILABLE:
- Emergency Protection Order (EPO)
- Temporary Restraining Order (TRO)
- Permanent Restraining Order
- Criminal charges through prosecutor's office
- Civil lawsuit for damages

EVIDENCE PRESERVATION:
- Photograph any injuries
- Keep medical records
- Save threatening messages/emails
- Maintain incident diary
- Collect witness statements

RESOURCES:
- National Domestic Violence Hotline: 1-800-799-7233
- Local Women's Shelter: [LOCAL NUMBER]
- Legal Aid Society: [LOCAL NUMBER]
- Victim Services: [LOCAL NUMBER]

SAFETY PLANNING:
- Identify safe places to go
- Keep important documents accessible
- Have emergency contact list
- Consider safety of children/pets

**CONFIDENTIALITY NOTICE:**
This document contains sensitive information and should be kept secure.

For immediate legal assistance, contact a domestic violence attorney or legal aid organization.

Document prepared: ${currentDate}
`;
}

function generateGenericLegalDocument(transcript: string, userName: string, category: string): string {
  const currentDate = new Date().toLocaleDateString();
  return `
FORMAL LEGAL NOTICE

TO: [RECIPIENT NAME]
FROM: ${userName}
DATE: ${currentDate}
RE: ${category.toUpperCase()} - FORMAL COMPLAINT

Dear [RECIPIENT NAME],

This letter serves as formal notice regarding a legal matter that requires your immediate attention.

MATTER DETAILS:
${transcript}

LEGAL POSITION:
Based on applicable laws and regulations, I believe my rights have been violated and seek appropriate remedy.

DEMAND:
I hereby formally request that you:
1. Address the issues outlined above
2. Provide appropriate compensation or remedy
3. Take corrective action to prevent future occurrences

TIMEFRAME:
Please respond within 30 days of receipt of this letter.

LEGAL CONSEQUENCES:
Failure to respond appropriately may result in formal legal action to protect my rights and seek appropriate remedies.

I prefer to resolve this matter amicably and look forward to your prompt response.

Sincerely,
${userName}
[Your Address]
[Your Phone Number]
[Your Email Address]

Date: ${currentDate}
`;
}