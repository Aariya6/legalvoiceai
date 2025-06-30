import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, Mic, BarChart3, Home, Zap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/record', icon: Mic, label: 'Submit Case' },
    { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                  <Scale className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Legal Voice AI
                </h1>
                <div className="flex items-center space-x-2">
                  <Zap className="h-3 w-3 text-yellow-400" />
                  <p className="text-sm text-blue-200">Powered by AWS Serverless</p>
                </div>
              </div>
            </Link>
            
            <div className="flex space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 font-medium ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-xl shadow-blue-500/30 transform scale-105'
                        : 'text-blue-200 hover:bg-white/10 hover:text-white hover:shadow-lg'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-sm border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-400" />
              <span className="text-blue-200 font-medium">Built with AWS Serverless Architecture</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm text-blue-300">
              <div>Lambda Functions</div>
              <div>Amazon Transcribe</div>
              <div>Amazon Bedrock</div>
              <div>S3 Storage</div>
              <div>SES/SNS Delivery</div>
            </div>
            <p className="text-blue-400 text-sm">
              © 2024 Legal Voice AI. Empowering justice through artificial intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};