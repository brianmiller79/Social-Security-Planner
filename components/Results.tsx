

import React, { useState } from 'react';
import { CalculationResult, UserInputs } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Sparkles, ArrowRight, DollarSign, Calculator, Info, Table, Check } from 'lucide-react';
import { generateAIAnalysis } from '../services/geminiService';

interface ResultsProps {
  result: CalculationResult;
  inputs: UserInputs;
}

const Results: React.FC<ResultsProps> = ({ result, inputs }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleGetAnalysis = async () => {
    setLoadingAi(true);
    const text = await generateAIAnalysis(result, inputs);
    setAiAnalysis(text);
    setLoadingAi(false);
  };

  // Prepare chart data: Top 35 years vs others
  const chartData = result.indexedEarnings.slice(-40).map(e => ({
    year: e.year,
    raw: e.raw,
    indexed: e.indexed,
    isUsed: e.usedInTop35,
    fill: e.usedInTop35 ? '#10b981' : '#cbd5e1' // Emerald-500 vs Slate-300
  }));

  const formatCurrency = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  const formatMoney = (val: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <DollarSign className="w-24 h-24" />
          </div>
          <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-1">Monthly Benefit</h3>
          <div className="text-4xl font-bold mb-2">{formatCurrency(result.benefit)}</div>
          <p className="text-slate-400 text-sm">
            Starting {inputs.benefitStartMonth}/{inputs.benefitStartYear} (Age {result.startAge.toFixed(1)})
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Adjusted PIA</h3>
           <div className="text-3xl font-bold text-slate-800 mb-2">{formatCurrency(result.pia)}</div>
           <p className="text-slate-500 text-sm">
             Primary Insurance Amount adjusted for COLA.
           </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">Monthly AIME</h3>
           <div className="text-3xl font-bold text-slate-800 mb-2">{formatCurrency(result.aime)}</div>
           <p className="text-slate-500 text-sm">
             Average Indexed Monthly Earnings (Top 35 Years).
           </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-slate-800">Earnings History (Indexed)</h3>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-emerald-500 rounded-full mr-2"></div>
              <span className="text-slate-600">Included in Top 35</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-slate-300 rounded-full mr-2"></div>
              <span className="text-slate-600">Not Included</span>
            </div>
          </div>
        </div>
        
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" tick={{fontSize: 12}} />
              <YAxis tickFormatter={(val) => `$${val/1000}k`} tick={{fontSize: 12}} />
              <Tooltip 
                formatter={(value: number) => formatCurrency(value)}
                labelStyle={{ color: '#1e293b' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Bar dataKey="indexed" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calculation Details Section (Bend Points + Table) */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => setShowDetails(!showDetails)}>
           <div className="flex items-center space-x-2">
             <div className="bg-orange-100 p-2 rounded-lg">
               <Table className="w-5 h-5 text-orange-600" />
             </div>
             <h3 className="text-lg font-bold text-slate-800">Calculation Breakdown</h3>
           </div>
           <button className="text-sm text-slate-500 font-medium">
             {showDetails ? "Hide Details" : "Show Details"}
           </button>
        </div>
        
        {showDetails && (
          <div className="p-6 bg-slate-50/50">
            {/* 1. Bend Points Formula */}
            <div className="mb-8">
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Base PIA Calculation (At Age 62)</h4>
              <div className="bg-white p-4 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">90% Bracket (First ${result.piaBreakdown.bendPoint1})</div>
                  <div className="text-lg font-bold text-slate-800">{formatMoney(result.piaBreakdown.portion90)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">32% Bracket (${result.piaBreakdown.bendPoint1} - ${result.piaBreakdown.bendPoint2})</div>
                  <div className="text-lg font-bold text-slate-800">{formatMoney(result.piaBreakdown.portion32)}</div>
                </div>
                <div className="p-3 bg-slate-50 rounded border border-slate-100">
                  <div className="text-xs text-slate-500 mb-1">15% Bracket (Above ${result.piaBreakdown.bendPoint2})</div>
                  <div className="text-lg font-bold text-slate-800">{formatMoney(result.piaBreakdown.portion15)}</div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                * Based on AIME of {formatMoney(result.aime)} using Bend Points for Age 62.
                This Base PIA is then adjusted by COLAs to reach the final Adjusted PIA.
              </p>
            </div>

            {/* 2. Detailed Earnings Table */}
            <div>
              <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Detailed Earnings Record</h4>
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white max-h-[500px] overflow-y-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Year</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actual Earnings</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Index Factor</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Indexed Earnings</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">Top 35</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {result.indexedEarnings.slice().reverse().map((record) => (
                      <tr key={record.year} className={record.usedInTop35 ? "bg-emerald-50/30" : ""}>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-slate-900">{record.year}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-600 text-right">{formatCurrency(record.raw)}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm text-slate-600 text-right">{record.factor.toFixed(3)}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-sm font-semibold text-slate-800 text-right">{formatCurrency(record.indexed)}</td>
                        <td className="px-6 py-3 whitespace-nowrap text-center">
                          {record.usedInTop35 && <Check className="w-4 h-4 text-emerald-500 mx-auto" />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI Advisor Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-blue-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-lg font-bold text-indigo-900">Gemini Financial Advisor</h3>
          </div>
          {!aiAnalysis && !loadingAi && (
            <button 
              onClick={handleGetAnalysis}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <span>Analyze Results</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {loadingAi && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
            <p className="text-sm text-indigo-600 animate-pulse">Consulting Gemini...</p>
          </div>
        )}

        {aiAnalysis && (
          <div className="prose prose-sm prose-indigo max-w-none bg-white p-6 rounded-lg shadow-sm border border-indigo-50/50">
            <pre className="whitespace-pre-wrap font-sans text-slate-700 text-sm leading-relaxed">
              {aiAnalysis}
            </pre>
          </div>
        )}
        
        {!aiAnalysis && !loadingAi && (
          <p className="text-sm text-indigo-700/70">
            Click "Analyze Results" to get a personalized strategy assessment powered by Google Gemini AI.
          </p>
        )}
      </div>

    </div>
  );
};

export default Results;
