import React from 'react';
import { Link } from 'react-router-dom';
import { Mic, FileText, Zap, Shield, Globe, Users, ArrowRight, CheckCircle, Star, Brain, Sparkles, Award, TrendingUp } from 'lucide-react';

export const Home: React.FC = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Legal Analysis',
      description: 'Advanced machine learning algorithms analyze your case and generate professional legal documents instantly.',
      color: 'from-purple-500 to-pink-500',
      stats: '95% Accuracy'
    },
    {
      icon: Mic,
      title: 'Voice-to-Legal Documents',
      description: 'Simply speak your legal issue and watch as AI transforms your words into professional legal language.',
      color: 'from-orange-500 to-red-500',
      stats: '2 Min Average'
    },
    {
      icon: Zap,
      title: 'Lightning Fast Processing',
      description: 'Powered by cutting-edge cloud infrastructure for instant document generation and delivery.',
      color: 'from-blue-500 to-cyan-500',
      stats: '24/7 Available'
    },
    {
      icon: Shield,
      title: 'Bank-Level Security',
      description: 'End-to-end encryption, secure cloud storage, and GDPR compliance protect your sensitive information.',
      color: 'from-green-500 to-emerald-500',
      stats: '100% Secure'
    },
    {
      icon: Globe,
      title: 'Multi-Language Support',
      description: 'Generate legal documents in multiple languages with culturally appropriate legal formatting.',
      color: 'from-indigo-500 to-purple-500',
      stats: '5+ Languages'
    },
    {
      icon: Users,
      title: 'Democratizing Justice',
      description: 'Making professional legal document creation accessible to everyone, regardless of background or budget.',
      color: 'from-pink-500 to-rose-500',
      stats: '10k+ Users'
    },
  ];

  const useCases = [
    { name: 'Security Deposit Recovery', icon: '🏠', description: 'Get your deposit back with professional demand letters', success: '94%' },
    { name: 'Wage Theft Claims', icon: '💰', description: 'Recover unpaid wages and overtime compensation', success: '89%' },
    { name: 'Loan Recovery Notices', icon: '📋', description: 'Professional debt collection and payment demands', success: '92%' },
    { name: 'Harassment Documentation', icon: '🛡️', description: 'Legal protection and restraining order assistance', success: '96%' },
    { name: 'Contract Disputes', icon: '⚖️', description: 'Breach of contract notifications and remedies', success: '88%' },
    { name: 'Consumer Protection', icon: '🛒', description: 'Product defects and service complaint letters', success: '91%' },
  ];

  const testimonials = [
    {
      name: 'Sarah Martinez',
      role: 'Small Business Owner',
      content: 'Recovered my $1,800 security deposit in just 5 days! The AI-generated letter was perfectly professional and legally sound.',
      rating: 5,
      avatar: '👩‍💼',
      amount: '$1,800'
    },
    {
      name: 'James Wilson',
      role: 'Freelance Developer',
      content: 'Got $3,200 in unpaid wages back from a difficult client. The legal document was so professional, they paid immediately.',
      rating: 5,
      avatar: '👨‍💻',
      amount: '$3,200'
    },
    {
      name: 'Maria Rodriguez',
      role: 'Restaurant Worker',
      content: 'The harassment complaint letter helped me get a restraining order. I felt empowered and protected. Thank you!',
      rating: 5,
      avatar: '👩‍🍳',
      amount: 'Justice'
    }
  ];

  const stats = [
    { number: '15,000+', label: 'Legal Documents Generated', icon: FileText },
    { number: '97%', label: 'Success Rate', icon: TrendingUp },
    { number: '2.3 min', label: 'Average Processing Time', icon: Zap },
    { number: '$2.1M+', label: 'Money Recovered for Users', icon: Award }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <div className="text-center py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-3xl"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        
        <div className="relative z-10">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full px-8 py-3 border border-purple-500/30 mb-8">
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
            <span className="text-purple-200 font-bold text-lg">AI-Powered Legal Revolution</span>
            <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
          </div>
          
          <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight">
            <span className="text-white">Transform Your </span>
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Voice
            </span>
            <br />
            <span className="text-white">Into </span>
            <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Legal Power
            </span>
          </h1>
          
          <p className="text-2xl text-blue-200 mb-12 max-w-5xl mx-auto leading-relaxed">
            Speak your legal issue and receive professionally formatted documents in minutes. 
            <span className="text-white font-bold"> Empowering justice through cutting-edge AI technology.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              to="/record"
              className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-6 rounded-2xl font-bold text-xl
                       hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300
                       shadow-2xl hover:shadow-blue-500/40 flex items-center justify-center space-x-4"
            >
              <Mic className="h-7 w-7" />
              <span>Start Recording Now</span>
              <ArrowRight className="h-6 w-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              to="/dashboard"
              className="bg-white/10 backdrop-blur-md text-white px-12 py-6 rounded-2xl font-bold text-xl
                       hover:bg-white/20 transform hover:scale-105 transition-all duration-300
                       border border-white/20 hover:border-white/40 flex items-center justify-center space-x-4"
            >
              <FileText className="h-7 w-7" />
              <span>View Dashboard</span>
            </Link>
          </div>

          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <Icon className="h-8 w-8 text-blue-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                  <div className="text-blue-200 text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Enhanced Features Grid */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Revolutionary Features</h2>
          <p className="text-2xl text-blue-200 max-w-4xl mx-auto">
            Built with cutting-edge AI technology for unparalleled legal document generation
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10
                         hover:bg-white/10 transition-all duration-500 hover:transform hover:scale-105
                         hover:shadow-2xl hover:border-white/20 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">{feature.title}</h3>
                    <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-500/30">
                      {feature.stats}
                    </span>
                  </div>
                  <p className="text-blue-200 leading-relaxed text-lg">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enhanced Use Cases */}
      <div className="bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-md rounded-3xl p-12 border border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-6">Proven Success Stories</h2>
          <p className="text-2xl text-blue-200">AI-powered solutions for real legal challenges</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-2xl p-8 
                       border border-white/10 hover:border-white/30 transition-all duration-300
                       hover:transform hover:scale-105 hover:shadow-xl group"
            >
              <div className="text-4xl mb-4">{useCase.icon}</div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-bold text-xl">{useCase.name}</h3>
                <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-500/30">
                  {useCase.success} success
                </span>
              </div>
              <p className="text-blue-200">{useCase.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Enhanced Testimonials */}
      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Real People, Real Results</h2>
          <p className="text-2xl text-blue-200">Join thousands who have successfully resolved their legal issues</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 
                       border border-white/10 hover:border-white/20 transition-all duration-300
                       hover:transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center mb-6">
                <div className="text-4xl mr-4">{testimonial.avatar}</div>
                <div>
                  <div className="text-white font-bold text-lg">{testimonial.name}</div>
                  <div className="text-blue-300">{testimonial.role}</div>
                </div>
                <div className="ml-auto bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 px-3 py-1 rounded-full text-sm font-bold border border-green-500/30">
                  {testimonial.amount}
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-blue-100 italic text-lg leading-relaxed">"{testimonial.content}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Technology Showcase */}
      <div className="bg-gradient-to-r from-slate-900/50 to-blue-900/50 backdrop-blur-md rounded-3xl p-12 border border-blue-500/20">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-white mb-6">Powered by Advanced AI</h2>
          <p className="text-2xl text-blue-200">Enterprise-grade artificial intelligence that understands legal language</p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-8">
          <div className="text-center group">
            <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-6 mb-4 border border-orange-500/30 group-hover:scale-110 transition-all duration-300">
              <Mic className="h-12 w-12 text-orange-400 mx-auto" />
            </div>
            <h3 className="text-white font-bold mb-2">Voice Capture</h3>
            <p className="text-orange-200 text-sm">Advanced audio processing</p>
          </div>
          
          <div className="text-center group">
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-6 mb-4 border border-blue-500/30 group-hover:scale-110 transition-all duration-300">
              <Brain className="h-12 w-12 text-blue-400 mx-auto" />
            </div>
            <h3 className="text-white font-bold mb-2">AI Transcription</h3>
            <p className="text-blue-200 text-sm">95% accuracy rate</p>
          </div>
          
          <div className="text-center group">
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-6 mb-4 border border-purple-500/30 group-hover:scale-110 transition-all duration-300">
              <Sparkles className="h-12 w-12 text-purple-400 mx-auto" />
            </div>
            <h3 className="text-white font-bold mb-2">Legal Analysis</h3>
            <p className="text-purple-200 text-sm">Context understanding</p>
          </div>
          
          <div className="text-center group">
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-6 mb-4 border border-green-500/30 group-hover:scale-110 transition-all duration-300">
              <FileText className="h-12 w-12 text-green-400 mx-auto" />
            </div>
            <h3 className="text-white font-bold mb-2">Document Generation</h3>
            <p className="text-green-200 text-sm">Professional formatting</p>
          </div>
          
          <div className="text-center group">
            <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-2xl p-6 mb-4 border border-indigo-500/30 group-hover:scale-110 transition-all duration-300">
              <Zap className="h-12 w-12 text-indigo-400 mx-auto" />
            </div>
            <h3 className="text-white font-bold mb-2">Instant Delivery</h3>
            <p className="text-indigo-200 text-sm">Real-time processing</p>
          </div>
        </div>
      </div>

      {/* Enhanced CTA Section */}
      <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl p-16 text-center border border-blue-500/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent"></div>
        <div className="relative z-10">
          <h2 className="text-6xl font-bold text-white mb-8">Ready to Transform Your Legal Challenge?</h2>
          <p className="text-2xl text-blue-200 mb-12 max-w-4xl mx-auto">
            Join thousands who have successfully resolved their legal issues with AI-powered document generation
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Link
              to="/record"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-6 rounded-2xl font-bold text-xl
                       hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-300
                       shadow-2xl hover:shadow-blue-500/40 flex items-center justify-center space-x-4"
            >
              <Mic className="h-7 w-7" />
              <span>Start Your Case Now</span>
              <ArrowRight className="h-6 w-6" />
            </Link>
            
            <div className="flex items-center justify-center space-x-4 text-green-200 bg-green-500/10 px-8 py-6 rounded-2xl border border-green-500/30">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-bold">Free to try • No credit card required</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-blue-200 max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span>Bank-level security</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-5 w-5 text-yellow-400" />
              <span>2-minute processing</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Users className="h-5 w-5 text-purple-400" />
              <span>15,000+ documents generated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};