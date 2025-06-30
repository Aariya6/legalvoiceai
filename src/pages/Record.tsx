import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, Upload, Send, AlertCircle, Zap, Shield, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import { useLegalCases } from '../hooks/useLegalCases';
import { VoiceRecorder } from '../components/VoiceRecorder';
import { FileUpload } from '../components/FileUpload';

export const Record: React.FC = () => {
  const navigate = useNavigate();
  const { createCase } = useLegalCases();
  const [activeTab, setActiveTab] = useState<'record' | 'upload'>('record');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    language: 'en'
  });
  const [audioData, setAudioData] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { value: 'Loan Recovery', icon: '💰', description: 'Debt collection and repayment demands' },
    { value: 'Property Dispute', icon: '🏠', description: 'Rental, lease, and property issues' },
    { value: 'Wage Theft', icon: '⚖️', description: 'Unpaid wages and labor violations' },
    { value: 'Harassment', icon: '🛡️', description: 'Workplace or personal harassment' },
    { value: 'Contract Dispute', icon: '📋', description: 'Breach of contract claims' },
    { value: 'Domestic Abuse', icon: '🆘', description: 'Safety and protection orders' },
    { value: 'Other', icon: '📄', description: 'Other legal matters' }
  ];

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioData || !userInfo.name || !userInfo.email || !userInfo.category) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert Blob to File
      const audioFile = new File([audioData], 'recording.webm', { type: audioData.type });
      
      // Create new case
      const caseId = await createCase({
        user_name: userInfo.name,
        email: userInfo.email,
        phone: userInfo.phone,
        category: userInfo.category,
        language: userInfo.language,
        method: activeTab
      }, audioFile);

      // Navigate to processing status
      navigate(`/processing/${caseId}`);
    } catch (error) {
      console.error('Error creating case:', error);
      setIsSubmitting(false);
      alert('Failed to create case. Please try again.');
    }
  };

  const isFormValid = audioData && userInfo.name && userInfo.email && userInfo.category;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-6 py-2 border border-blue-500/30 mb-6">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span className="text-blue-200 font-medium">AWS Serverless Legal AI</span>
        </div>
        
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Submit Your Legal Issue
          </span>
        </h1>
        
        <p className="text-blue-200 text-xl max-w-4xl mx-auto leading-relaxed">
          Record your complaint or upload an audio file. Our AWS-powered AI will generate professional legal documents in minutes.
        </p>
      </div>

      {/* Features Preview */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl p-6 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-3 w-fit mb-4">
            <Zap className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">AI-Powered Analysis</h3>
          <p className="text-blue-200">Amazon Bedrock Claude analyzes your case with 94% accuracy</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-2xl p-6 border border-green-500/20 hover:border-green-400/40 transition-all duration-300">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-3 w-fit mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Bank-Level Security</h3>
          <p className="text-green-200">AWS encryption & GDPR compliance protection</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-3 w-fit mb-4">
            <Globe className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Multi-Language Support</h3>
          <p className="text-purple-200">Professional documents in 5+ languages</p>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Step 1: User Information */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Your Information</h2>
                <p className="text-blue-200">Tell us who you are and how we can reach you</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-white font-bold text-lg">Full Name *</label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg
                           placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           backdrop-blur-sm transition-all duration-200"
                  placeholder="Enter your full legal name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-white font-bold text-lg">Email Address *</label>
                <input
                  type="email"
                  value={userInfo.email}
                  onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg
                           placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           backdrop-blur-sm transition-all duration-200"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-white font-bold text-lg">Phone Number (Optional)</label>
                <input
                  type="tel"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({...userInfo, phone: e.target.value})}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg
                           placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           backdrop-blur-sm transition-all duration-200"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-white font-bold text-lg">Preferred Language</label>
                <select
                  value={userInfo.language}
                  onChange={(e) => setUserInfo({...userInfo, language: e.target.value})}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-2xl text-white text-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           backdrop-blur-sm transition-all duration-200 appearance-none cursor-pointer"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-800 text-white">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Legal Category */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Legal Category</h2>
                <p className="text-blue-200">Choose the category that best describes your legal issue</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.value}
                  className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
                    userInfo.category === category.value
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-500/20 border-blue-500 shadow-xl shadow-blue-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                  onClick={() => setUserInfo({...userInfo, category: category.value})}
                >
                  <div className="text-center space-y-3">
                    <div className="text-4xl">{category.icon}</div>
                    <h3 className="text-white font-bold text-lg">{category.value}</h3>
                    <p className="text-blue-200 text-sm">{category.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Voice Input */}
          <div className="space-y-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Voice Input</h2>
                <p className="text-blue-200">Record your issue or upload an audio file</p>
              </div>
            </div>
            
            {/* Tab Navigation */}
            <div className="flex space-x-2 bg-white/5 rounded-2xl p-2">
              <button
                type="button"
                onClick={() => setActiveTab('record')}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  activeTab === 'record'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Mic className="h-5 w-5 inline mr-3" />
                Record Audio
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 ${
                  activeTab === 'upload'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Upload className="h-5 w-5 inline mr-3" />
                Upload File
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-gradient-to-r from-white/5 to-white/10 rounded-2xl p-8 backdrop-blur-sm border border-white/10">
              {activeTab === 'record' ? (
                <VoiceRecorder onAudioReady={setAudioData} />
              ) : (
                <FileUpload onFileSelected={setAudioData} />
              )}
            </div>
          </div>

          {/* Submit Section */}
          <div className="flex items-center justify-between pt-8 border-t border-white/20">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-blue-200">
                <Shield className="h-5 w-5" />
                <span>All data encrypted with AWS security</span>
              </div>
              {isFormValid && (
                <div className="flex items-center space-x-2 text-green-200">
                  <CheckCircle className="h-5 w-5" />
                  <span>Ready to submit</span>
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className={`flex items-center space-x-3 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
                isFormValid && !isSubmitting
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/30'
                  : 'bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Send className="h-6 w-6" />
                  <span>Submit Legal Case</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Process Preview */}
      <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 rounded-2xl p-8 border border-blue-500/20">
        <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center">
          <Zap className="h-6 w-6 mr-3 text-yellow-400" />
          What happens after you submit?
        </h3>
        <div className="grid md:grid-cols-4 gap-6 text-center">
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 border border-blue-500/30">
              <Upload className="h-8 w-8 text-blue-400 mx-auto" />
            </div>
            <h4 className="text-white font-bold">1. Secure Upload</h4>
            <p className="text-blue-200 text-sm">Your audio is encrypted and stored in AWS S3</p>
          </div>
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-500/30">
              <Mic className="h-8 w-8 text-purple-400 mx-auto" />
            </div>
            <h4 className="text-white font-bold">2. AI Transcription</h4>
            <p className="text-blue-200 text-sm">AWS Transcribe converts speech to text</p>
          </div>
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
              <Zap className="h-8 w-8 text-yellow-400 mx-auto" />
            </div>
            <h4 className="text-white font-bold">3. Legal Analysis</h4>
            <p className="text-blue-200 text-sm">Amazon Bedrock generates your document</p>
          </div>
          <div className="space-y-3">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-4 border border-green-500/30">
              <Send className="h-8 w-8 text-green-400 mx-auto" />
            </div>
            <h4 className="text-white font-bold">4. Instant Delivery</h4>
            <p className="text-blue-200 text-sm">Professional PDF sent to your email</p>
          </div>
        </div>
      </div>
    </div>
  );
};