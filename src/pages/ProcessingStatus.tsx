import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, Download, Mail, MessageSquare, Zap, FileText, Send, ArrowRight } from 'lucide-react';
import { useLegalCases } from '../hooks/useLegalCases';

export const ProcessingStatus: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { getCaseById, cases } = useLegalCases();
  const [refreshKey, setRefreshKey] = useState(0);
  
  const case_ = getCaseById(caseId || '');

  const steps = [
    { 
      id: 'upload', 
      label: 'Lambda Upload Handler', 
      description: 'Audio file securely uploaded to AWS S3 bucket',
      icon: FileText,
      color: 'from-blue-500 to-cyan-500',
      aws: 'Lambda + S3'
    },
    { 
      id: 'transcribing', 
      label: 'AWS Transcribe', 
      description: 'Converting speech to text with 94% accuracy',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500',
      aws: 'Amazon Transcribe'
    },
    { 
      id: 'generating', 
      label: 'Amazon Bedrock AI', 
      description: 'Generating professional legal document',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      aws: 'Bedrock Claude'
    },
    { 
      id: 'completed', 
      label: 'Document Delivery', 
      description: 'Professional legal document ready for download',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-500',
      aws: 'SES + SNS'
    }
  ];

  useEffect(() => {
    if (!case_) {
      navigate('/dashboard');
      return;
    }

    // Refresh component when case updates
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, [case_, caseId, navigate, cases]);

  if (!case_) {
    return (
      <div className="text-center py-20">
        <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-3xl p-12 border border-red-500/20 max-w-2xl mx-auto">
          <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-4">Case Not Found</h2>
          <p className="text-red-200 mb-8 text-lg">The case you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                     text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 
                     shadow-lg hover:shadow-blue-500/30 transform hover:scale-105"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const getCurrentStepIndex = () => {
    switch (case_.status) {
      case 'processing': return 0;
      case 'transcribing': return 1;
      case 'generating': return 2;
      case 'completed': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = getCurrentStepIndex();
  const isComplete = case_.status === 'completed';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-6 py-2 border border-blue-500/30 mb-6">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span className="text-blue-200 font-medium">AWS Serverless Processing</span>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">
          {isComplete ? (
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              🎉 Case Completed Successfully!
            </span>
          ) : (
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              ⚡ Processing Your Legal Case
            </span>
          )}
        </h1>
        
        <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 rounded-2xl p-4 border border-blue-500/20 inline-block">
          <p className="text-blue-200 text-lg">
            Case ID: <span className="font-mono bg-blue-500/20 px-3 py-1 rounded-lg text-white font-bold">
              {case_.id.substring(0, 12)}...
            </span>
          </p>
        </div>
      </div>

      {/* Case Details Card */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8">
        <div className="grid md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-white/20">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <FileText className="h-6 w-6 mr-3 text-blue-400" />
              Case Information
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-200 font-medium">Name:</span>
                <span className="text-white font-bold">{case_.user_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200 font-medium">Category:</span>
                <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white font-bold px-3 py-1 rounded-lg border border-purple-500/30">
                  {case_.category}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200 font-medium">Language:</span>
                <span className="text-white font-bold">{case_.language.toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200 font-medium">Method:</span>
                <span className="text-white font-bold">
                  {case_.method === 'record' ? '🎤 Voice Recording' : '📎 File Upload'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
              <Mail className="h-6 w-6 mr-3 text-green-400" />
              Delivery Details
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-200 font-medium">Email:</span>
                <span className="text-white font-bold">{case_.email}</span>
              </div>
              {case_.phone && (
                <div className="flex justify-between items-center">
                  <span className="text-blue-200 font-medium">Phone:</span>
                  <span className="text-white font-bold">{case_.phone}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-blue-200 font-medium">Created:</span>
                <span className="text-white font-bold">
                  {new Date(case_.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-200 font-medium">Status:</span>
                <span className={`font-bold px-3 py-1 rounded-lg ${
                  isComplete 
                    ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border border-green-500/30' 
                    : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {isComplete ? '✅ Completed' : '⚡ Processing'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* AWS Processing Pipeline */}
        <div className="space-y-8">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-white mb-4 flex items-center justify-center">
              <Zap className="h-8 w-8 mr-3 text-yellow-400" />
              AWS Serverless Processing Pipeline
            </h3>
            <p className="text-blue-200 text-lg">Enterprise-grade infrastructure processing your legal case</p>
          </div>
          
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex && !isComplete;
              const isCompleted = index < currentStepIndex || isComplete;
              const isPending = index > currentStepIndex && !isComplete;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  className={`flex items-center p-8 rounded-2xl border transition-all duration-500 ${
                    isActive
                      ? `bg-gradient-to-r ${step.color}/20 border-2 shadow-2xl`
                      : isCompleted
                      ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30 shadow-lg'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center mr-8 transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${step.color} animate-pulse shadow-xl`
                      : isCompleted
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg'
                      : 'bg-gray-600'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="h-8 w-8 text-white" />
                    ) : isActive ? (
                      <Clock className="h-8 w-8 text-white animate-spin" />
                    ) : (
                      <Icon className="h-8 w-8 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex items-center space-x-4 mb-2">
                      <h4 className={`font-bold text-xl ${
                        isActive || isCompleted ? 'text-white' : 'text-gray-400'
                      }`}>
                        {step.label}
                      </h4>
                      <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        isActive || isCompleted 
                          ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' 
                          : 'bg-gray-600/20 text-gray-400'
                      }`}>
                        {step.aws}
                      </span>
                    </div>
                    <p className={`text-sm ${
                      isActive || isCompleted ? 'text-blue-200' : 'text-gray-500'
                    }`}>
                      {step.description}
                    </p>
                  </div>

                  {isActive && (
                    <div className="flex-shrink-0 ml-8">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-100"></div>
                        <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-200"></div>
                      </div>
                    </div>
                  )}

                  {isCompleted && index < steps.length - 1 && (
                    <div className="flex-shrink-0 ml-8">
                      <ArrowRight className="h-6 w-6 text-green-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Transcription Preview */}
        {case_.transcription && (
          <div className="mt-12 pt-8 border-t border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MessageSquare className="h-6 w-6 mr-3 text-purple-400" />
              Transcription Preview
            </h3>
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20">
              <p className="text-purple-100 italic text-lg leading-relaxed">
                "{case_.transcription.substring(0, 400)}..."
              </p>
            </div>
          </div>
        )}

        {/* Completion Actions */}
        {isComplete && (
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-3xl p-8">
              <div className="flex items-center mb-8">
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-4 mr-6">
                  <CheckCircle className="h-12 w-12 text-white" />
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-white mb-2">Legal Document Generated Successfully!</h3>
                  <p className="text-green-200 text-lg">Your professional legal document has been generated and is ready for download. Email notification sent.</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-6">
                <button
                  className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                           text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-blue-500/30
                           transform hover:scale-105"
                  onClick={() => {
                    if (case_.document_url) {
                      window.open(case_.document_url, '_blank');
                    } else {
                      // Fallback download simulation
                      const link = document.createElement('a');
                      link.href = '#';
                      link.download = `legal-document-${case_.id}.pdf`;
                      link.click();
                    }
                  }}
                >
                  <Download className="h-6 w-6" />
                  <span>Download PDF Document</span>
                </button>
                
                <button
                  className="flex items-center space-x-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                           text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-green-500/30
                           transform hover:scale-105"
                  onClick={() => navigate('/dashboard')}
                >
                  <FileText className="h-6 w-6" />
                  <span>View All Cases</span>
                </button>

                <button
                  className="flex items-center space-x-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 
                           text-white px-8 py-4 rounded-2xl font-bold transition-all duration-300 shadow-xl hover:shadow-purple-500/30
                           transform hover:scale-105"
                  onClick={() => navigate('/record')}
                >
                  <Send className="h-6 w-6" />
                  <span>Create New Case</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Real-time Status */}
      {!isComplete && (
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6 text-center backdrop-blur-sm">
          <div className="flex items-center justify-center space-x-3 text-blue-200 mb-4">
            <Clock className="h-6 w-6 animate-spin" />
            <span className="text-lg font-medium">Processing in real-time using AWS serverless architecture...</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-blue-300">
              <span className="font-bold">⚡ Average processing time:</span> 2-3 minutes
            </div>
            <div className="text-blue-300">
              <span className="font-bold">🔄 Updates:</span> Automatically every 2 seconds
            </div>
            <div className="text-blue-300">
              <span className="font-bold">🛡️ Security:</span> End-to-end encrypted
            </div>
          </div>
        </div>
      )}
    </div>
  );
};