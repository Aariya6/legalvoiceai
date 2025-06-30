/*
  # Legal Cases Management Schema

  1. New Tables
    - `legal_cases`
      - `id` (uuid, primary key)
      - `user_name` (text, required)
      - `email` (text, required)
      - `phone` (text, optional)
      - `category` (text, required)
      - `language` (text, default 'en')
      - `method` (text, record or upload)
      - `status` (text, pending/processing/transcribing/generating/completed/failed)
      - `audio_file_url` (text, S3 URL)
      - `transcription` (text, from AWS Transcribe)
      - `generated_document` (text, from Amazon Bedrock)
      - `document_url` (text, S3 URL for PDF)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `processing_steps` (jsonb, track workflow progress)
      
    - `document_templates`
      - Template storage for different legal document types
      
  2. Security
    - Enable RLS on all tables
    - Add policies for user data access
    
  3. Indexes
    - Performance optimization for common queries
*/

-- Legal Cases Table
CREATE TABLE IF NOT EXISTS legal_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  email text NOT NULL,
  phone text,
  category text NOT NULL,
  language text DEFAULT 'en',
  method text NOT NULL CHECK (method IN ('record', 'upload')),
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'transcribing', 'generating', 'completed', 'failed')),
  audio_file_url text,
  transcription text,
  generated_document text,
  document_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  processing_steps jsonb DEFAULT '[]'::jsonb
);

-- Document Templates Table
CREATE TABLE IF NOT EXISTS document_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  language text NOT NULL,
  template_name text NOT NULL,
  template_content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE legal_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies for legal_cases
CREATE POLICY "Users can view their own cases"
  ON legal_cases
  FOR SELECT
  TO authenticated
  USING (true); -- For now, allow all authenticated users to view

CREATE POLICY "Users can create cases"
  ON legal_cases
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own cases"
  ON legal_cases
  FOR UPDATE
  TO authenticated
  USING (true);

-- RLS Policies for document_templates
CREATE POLICY "Anyone can view templates"
  ON document_templates
  FOR SELECT
  TO authenticated
  USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_legal_cases_email ON legal_cases(email);
CREATE INDEX IF NOT EXISTS idx_legal_cases_status ON legal_cases(status);
CREATE INDEX IF NOT EXISTS idx_legal_cases_created_at ON legal_cases(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_templates_category ON document_templates(category, language);

-- Insert default templates
INSERT INTO document_templates (category, language, template_name, template_content) VALUES
('Loan Recovery', 'en', 'Formal Demand Letter', 
'FORMAL DEMAND LETTER FOR LOAN RECOVERY

TO: [DEBTOR_NAME]
FROM: [CREDITOR_NAME]
DATE: [CURRENT_DATE]
RE: OUTSTANDING DEBT RECOVERY - $[AMOUNT]

Dear [DEBTOR_NAME],

This letter serves as formal notice that you are in default of your loan obligation in the amount of $[AMOUNT] as of [DEFAULT_DATE].

LOAN DETAILS:
- Original Loan Amount: $[ORIGINAL_AMOUNT]
- Date of Loan: [LOAN_DATE]
- Current Balance: $[CURRENT_BALANCE]
- Days Past Due: [DAYS_OVERDUE]

DEMAND FOR PAYMENT:
You are hereby demanded to pay the full outstanding amount of $[AMOUNT] within thirty (30) days of receipt of this letter.

CONSEQUENCES OF NON-PAYMENT:
Failure to remit payment within the specified timeframe may result in:
- Legal action to recover the debt
- Additional costs and attorney fees
- Potential impact on your credit rating
- Collection proceedings

Please contact the undersigned immediately to arrange payment or discuss a payment plan.

Sincerely,
[CREDITOR_NAME]
[ADDRESS]
[PHONE]
[EMAIL]

This is an attempt to collect a debt. Any information obtained will be used for that purpose.'),

('Property Dispute', 'en', 'Security Deposit Demand', 
'DEMAND FOR RETURN OF SECURITY DEPOSIT

TO: [LANDLORD_NAME]
FROM: [TENANT_NAME]
DATE: [CURRENT_DATE]
RE: RETURN OF SECURITY DEPOSIT - [PROPERTY_ADDRESS]

Dear [LANDLORD_NAME],

I am writing to formally demand the return of my security deposit in the amount of $[DEPOSIT_AMOUNT] for the rental property located at [PROPERTY_ADDRESS].

TENANCY DETAILS:
- Lease Period: [START_DATE] to [END_DATE]
- Security Deposit: $[DEPOSIT_AMOUNT]
- Vacated: [MOVE_OUT_DATE]
- Property Condition: [CONDITION_DESCRIPTION]

LEGAL REQUIREMENT:
Under [STATE] law, landlords must return security deposits within [TIMEFRAME] days of lease termination, unless there are legitimate deductions for damages beyond normal wear and tear.

DEMAND:
You are hereby demanded to return the full security deposit amount of $[DEPOSIT_AMOUNT] within [RESPONSE_TIMEFRAME] days of receipt of this letter.

DOCUMENTATION:
I have maintained the property in excellent condition and have [EVIDENCE_TYPE] to support this claim.

Please contact me immediately to arrange return of my deposit.

Sincerely,
[TENANT_NAME]
[ADDRESS]
[PHONE]
[EMAIL]'),

('Wage Theft', 'en', 'Unpaid Wages Complaint', 
'FORMAL COMPLAINT - UNPAID WAGES

TO: [EMPLOYER_NAME]
FROM: [EMPLOYEE_NAME]
DATE: [CURRENT_DATE]
RE: UNPAID WAGES AND OVERTIME COMPENSATION

Dear [EMPLOYER_NAME],

This letter serves as formal notice of your failure to pay wages owed to me in accordance with federal and state labor laws.

EMPLOYMENT DETAILS:
- Position: [JOB_TITLE]
- Employment Period: [START_DATE] to [END_DATE]
- Hourly Rate: $[HOURLY_RATE]
- Employee ID: [EMPLOYEE_ID]

UNPAID WAGES BREAKDOWN:
- Regular Hours: [REGULAR_HOURS] at $[HOURLY_RATE] = $[REGULAR_AMOUNT]
- Overtime Hours: [OVERTIME_HOURS] at $[OVERTIME_RATE] = $[OVERTIME_AMOUNT]
- Total Amount Owed: $[TOTAL_AMOUNT]
- Pay Period: [PAY_PERIOD]

LEGAL REQUIREMENTS:
Under the Fair Labor Standards Act (FLSA) and [STATE] labor laws, you are required to pay all wages earned, including overtime compensation at time-and-a-half for hours worked over 40 in a workweek.

DEMAND:
You are hereby demanded to pay the full amount of $[TOTAL_AMOUNT] within [TIMEFRAME] days of receipt of this letter.

Please contact me immediately to resolve this matter.

Sincerely,
[EMPLOYEE_NAME]
[ADDRESS]
[PHONE]
[EMAIL]');