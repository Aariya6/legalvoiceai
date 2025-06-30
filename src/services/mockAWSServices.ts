// Mock AWS services for demonstration purposes
// In a real implementation, these would be actual AWS SDK calls

interface TranscriptionResult {
  transcript: string;
  confidence: number;
  language: string;
}

interface LegalDocument {
  title: string;
  content: string;
  type: 'notice' | 'complaint' | 'contract';
  language: string;
}

export class MockAWSTranscribe {
  static async transcribeAudio(audioBlob: Blob): Promise<TranscriptionResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock transcription based on common legal scenarios
    const mockTranscriptions = [
      {
        transcript: "I am writing to formally request the return of my security deposit in the amount of $1,200 from the rental property located at 123 Main Street. I vacated the premises on December 15th, 2023, and left the property in excellent condition. Despite multiple attempts to contact the landlord, I have not received my deposit back within the required 30-day period.",
        confidence: 0.94,
        language: 'en'
      },
      {
        transcript: "I am filing a complaint against my former employer for wage theft. They have failed to pay me for overtime hours worked during the months of October and November 2023. The total amount owed is approximately $2,400. I have documentation of all hours worked and have attempted to resolve this matter directly with HR without success.",
        confidence: 0.92,
        language: 'en'
      },
      {
        transcript: "I need to file a restraining order against my neighbor who has been harassing me and my family for the past six months. The harassment includes verbal threats, property damage, and intimidation. I have police reports and witness statements to support my case.",
        confidence: 0.96,
        language: 'en'
      }
    ];

    return mockTranscriptions[Math.floor(Math.random() * mockTranscriptions.length)];
  }
}

export class MockAmazonBedrock {
  static async generateLegalDocument(
    transcript: string,
    category: string,
    language: string
  ): Promise<LegalDocument> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const mockDocuments: Record<string, LegalDocument> = {
      'Loan Recovery': {
        title: 'Formal Demand Letter for Loan Recovery',
        content: `
FORMAL DEMAND LETTER

TO: [DEBTOR NAME]
FROM: [YOUR NAME]
DATE: ${new Date().toLocaleDateString()}
RE: OUTSTANDING DEBT RECOVERY

Dear [DEBTOR NAME],

This letter serves as formal notice that you are in default of your loan obligation in the amount of $[AMOUNT] as of [DATE].

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
[YOUR NAME]
[YOUR ADDRESS]
[PHONE NUMBER]
[EMAIL ADDRESS]

This is an attempt to collect a debt. Any information obtained will be used for that purpose.
        `,
        type: 'notice',
        language: 'en'
      },
      'Property Dispute': {
        title: 'Security Deposit Demand Letter',
        content: `
DEMAND FOR RETURN OF SECURITY DEPOSIT

TO: [LANDLORD NAME]
FROM: [TENANT NAME]
DATE: ${new Date().toLocaleDateString()}
RE: RETURN OF SECURITY DEPOSIT

Dear [LANDLORD NAME],

I am writing to formally demand the return of my security deposit in the amount of $[AMOUNT] for the rental property located at [PROPERTY ADDRESS].

TENANCY DETAILS:
- Lease Period: [START DATE] to [END DATE]
- Security Deposit: $[AMOUNT]
- Vacated: [MOVE-OUT DATE]

LEGAL REQUIREMENT:
Under [STATE] law, landlords must return security deposits within [NUMBER] days of lease termination, unless there are legitimate deductions for damages beyond normal wear and tear.

DEMAND:
You are hereby demanded to return the full security deposit amount of $[AMOUNT] within [TIMEFRAME] days of receipt of this letter.

CONSEQUENCES:
Failure to comply may result in legal action seeking:
- Return of the full deposit amount
- Statutory penalties
- Attorney fees and court costs

Please contact me immediately to arrange return of my deposit.

Sincerely,
[YOUR NAME]
[YOUR ADDRESS]
[PHONE NUMBER]
[EMAIL ADDRESS]
        `,
        type: 'notice',
        language: 'en'
      },
      'Wage Theft': {
        title: 'Wage and Hour Complaint Letter',
        content: `
FORMAL COMPLAINT - UNPAID WAGES

TO: [EMPLOYER NAME]
FROM: [EMPLOYEE NAME]
DATE: ${new Date().toLocaleDateString()}
RE: UNPAID WAGES AND OVERTIME

Dear [EMPLOYER NAME],

This letter serves as formal notice of your failure to pay wages owed to me in accordance with federal and state labor laws.

EMPLOYMENT DETAILS:
- Position: [JOB TITLE]
- Employment Period: [START DATE] to [END DATE]
- Hourly Rate: $[RATE]

UNPAID WAGES:
- Regular Hours: [HOURS] at $[RATE] = $[AMOUNT]
- Overtime Hours: [HOURS] at $[OVERTIME RATE] = $[AMOUNT]
- Total Amount Owed: $[TOTAL AMOUNT]

LEGAL REQUIREMENTS:
Under the Fair Labor Standards Act (FLSA) and [STATE] labor laws, you are required to pay all wages earned, including overtime compensation at time-and-a-half for hours worked over 40 in a workweek.

DEMAND:
You are hereby demanded to pay the full amount of $[TOTAL AMOUNT] within [TIMEFRAME] days of receipt of this letter.

LEGAL ACTION:
Failure to pay may result in:
- Filing with the Department of Labor
- Civil lawsuit for unpaid wages
- Liquidated damages
- Attorney fees and court costs

Please contact me immediately to resolve this matter.

Sincerely,
[YOUR NAME]
[YOUR ADDRESS]
[PHONE NUMBER]
[EMAIL ADDRESS]
        `,
        type: 'complaint',
        language: 'en'
      }
    };

    return mockDocuments[category] || mockDocuments['Property Dispute'];
  }
}

export class MockAWSSES {
  static async sendEmail(
    to: string,
    subject: string,
    body: string,
    attachment?: Blob
  ): Promise<{ messageId: string }> {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Mock Email Sent:
To: ${to}
Subject: ${subject}
Body: ${body.substring(0, 100)}...
Attachment: ${attachment ? 'PDF Document' : 'None'}`);

    return {
      messageId: `mock-email-${Date.now()}`
    };
  }
}

export class MockAWSSNS {
  static async sendSMS(
    phoneNumber: string,
    message: string
  ): Promise<{ messageId: string }> {
    // Simulate SMS sending delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    console.log(`Mock SMS Sent:
To: ${phoneNumber}
Message: ${message}`);

    return {
      messageId: `mock-sms-${Date.now()}`
    };
  }
}