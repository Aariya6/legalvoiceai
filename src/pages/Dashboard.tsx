import React, { useState } from 'react';
import { Search, Filter, Download, ExternalLink, Clock, CheckCircle, AlertCircle, TrendingUp, Users, Zap } from 'lucide-react';
import { useLegalCases } from '../hooks/useLegalCases';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { cases } = useLegalCases();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'processing' | 'completed'>('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = ['all', 'Loan Recovery', 'Domestic Abuse', 'Wage Theft', 'Property Dispute', 'Harassment', 'Contract Dispute', 'Other'];

  const filteredCases = cases.filter(case_ => {
    const matchesSearch = case_.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         case_.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || case_.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || case_.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'processing':
        return <Clock className="h-5 w-5 text-blue-400 animate-spin" />;
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30';
      case 'processing':
        return 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const stats = {
    total: cases.length,
    completed: cases.filter(c => c.status === 'completed').length,
    processing: cases.filter(c => c.status === 'processing').length,
    pending: cases.filter(c => c.status === 'pending').length,
  };

  const successRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full px-6 py-2 border border-blue-500/30 mb-6">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span className="text-blue-200 font-medium">AWS Serverless Dashboard</span>
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent mb-4">
          Legal Case Dashboard
        </h1>
        <p className="text-blue-200 text-xl">Track your legal document generation progress in real-time</p>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-md rounded-2xl p-8 border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-2">Total Cases</p>
              <p className="text-4xl font-bold text-white">{stats.total}</p>
              <p className="text-blue-300 text-xs mt-1">All time submissions</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 p-4 rounded-2xl">
              <Users className="h-8 w-8 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 backdrop-blur-md rounded-2xl p-8 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium mb-2">Processing</p>
              <p className="text-4xl font-bold text-white">{stats.processing}</p>
              <p className="text-purple-300 text-xs mt-1">AWS Lambda active</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-4 rounded-2xl">
              <Clock className="h-8 w-8 text-purple-400 animate-spin" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-md rounded-2xl p-8 border border-green-500/20 hover:border-green-400/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm font-medium mb-2">Completed</p>
              <p className="text-4xl font-bold text-white">{stats.completed}</p>
              <p className="text-green-300 text-xs mt-1">Documents delivered</p>
            </div>
            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 p-4 rounded-2xl">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 backdrop-blur-md rounded-2xl p-8 border border-yellow-500/20 hover:border-yellow-400/40 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 text-sm font-medium mb-2">Success Rate</p>
              <p className="text-4xl font-bold text-white">{successRate}%</p>
              <p className="text-yellow-300 text-xs mt-1">AI accuracy</p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 p-4 rounded-2xl">
              <TrendingUp className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl p-8 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-300" />
              <input
                type="text"
                placeholder="Search by name, category, or case ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white text-lg
                         placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         backdrop-blur-sm transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-300" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="pl-10 pr-8 py-4 bg-white/10 border border-white/20 rounded-xl text-white 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">All Status</option>
                <option value="pending" className="bg-slate-800">Pending</option>
                <option value="processing" className="bg-slate-800">Processing</option>
                <option value="completed" className="bg-slate-800">Completed</option>
              </select>
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-4 bg-white/10 border border-white/20 rounded-xl text-white 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Cases Table */}
      <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-white/10 to-white/5">
              <tr className="border-b border-white/10">
                <th className="text-left py-6 px-8 text-white font-bold text-lg">Case ID</th>
                <th className="text-left py-6 px-8 text-white font-bold text-lg">Client</th>
                <th className="text-left py-6 px-8 text-white font-bold text-lg">Category</th>
                <th className="text-left py-6 px-8 text-white font-bold text-lg">Status</th>
                <th className="text-left py-6 px-8 text-white font-bold text-lg">Created</th>
                <th className="text-left py-6 px-8 text-white font-bold text-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-20">
                    {cases.length === 0 ? (
                      <div className="space-y-6">
                        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-12 max-w-md mx-auto border border-blue-500/20">
                          <AlertCircle className="h-16 w-16 mx-auto mb-6 text-blue-400" />
                          <h3 className="text-2xl font-bold text-white mb-4">No Cases Found</h3>
                          <p className="text-blue-200 mb-6">Start by creating your first legal case using our AI-powered system</p>
                          <Link
                            to="/record"
                            className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-600 
                                     hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl 
                                     font-bold transition-all duration-300 shadow-xl hover:shadow-blue-500/30
                                     transform hover:scale-105"
                          >
                            <Zap className="h-5 w-5" />
                            <span>Create Your First Case</span>
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <AlertCircle className="h-12 w-12 mx-auto text-yellow-400" />
                        <div>
                          <p className="text-lg font-medium text-white mb-2">No cases match your current filters</p>
                          <button
                            onClick={() => {
                              setSearchTerm('');
                              setFilterStatus('all');
                              setFilterCategory('all');
                            }}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
                                     text-white px-6 py-3 rounded-xl font-medium transition-all duration-300"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                filteredCases.map((case_) => (
                  <tr key={case_.id} className="border-b border-white/5 hover:bg-white/5 transition-all duration-200">
                    <td className="py-6 px-8">
                      <div className="font-mono text-blue-300 bg-blue-500/10 px-3 py-1 rounded-lg border border-blue-500/20 text-sm">
                        {case_.id.substring(0, 12)}...
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div>
                        <div className="text-white font-bold text-lg">{case_.user_name}</div>
                        <div className="text-blue-200 text-sm">{case_.email}</div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 px-3 py-2 
                                     rounded-lg text-sm font-medium border border-purple-500/30">
                        {case_.category}
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <span className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-bold border ${getStatusColor(case_.status)}`}>
                        {getStatusIcon(case_.status)}
                        <span className="capitalize">{case_.status}</span>
                      </span>
                    </td>
                    <td className="py-6 px-8">
                      <div className="text-blue-200">
                        <div className="font-medium">{new Date(case_.created_at).toLocaleDateString()}</div>
                        <div className="text-xs text-blue-300">{new Date(case_.created_at).toLocaleTimeString()}</div>
                      </div>
                    </td>
                    <td className="py-6 px-8">
                      <div className="flex items-center space-x-3">
                        {case_.status === 'processing' ? (
                          <Link
                            to={`/processing/${case_.id}`}
                            className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 
                                     hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg 
                                     font-medium transition-all duration-200 shadow-lg hover:shadow-blue-500/30"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Status</span>
                          </Link>
                        ) : case_.status === 'completed' ? (
                          <button
                            onClick={() => {
                              // Simulate download
                              const link = document.createElement('a');
                              link.href = '#';
                              link.download = `legal-document-${case_.id}.pdf`;
                              link.click();
                            }}
                            className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-500 
                                     hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg 
                                     font-medium transition-all duration-200 shadow-lg hover:shadow-green-500/30"
                          >
                            <Download className="h-4 w-4" />
                            <span>Download</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm font-medium">Pending</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Stats */}
      {cases.length > 0 && (
        <div className="bg-gradient-to-r from-slate-800/50 to-blue-900/50 rounded-2xl p-6 border border-blue-500/20 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-blue-200">
            <div>
              <span className="font-bold text-white">⚡ Powered by:</span> AWS Lambda, Transcribe & Bedrock
            </div>
            <div>
              <span className="font-bold text-white">🔒 Security:</span> End-to-end encrypted
            </div>
            <div>
              <span className="font-bold text-white">🌍 Available:</span> 24/7 serverless processing
            </div>
          </div>
        </div>
      )}
    </div>
  );
};