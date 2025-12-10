import React, { useState, useEffect } from 'react';
import { Calculator } from 'lucide-react';
import FileUpload from './components/FileUpload';
import InputForm from './components/InputForm';
import Results from './components/Results';
import { calculateBenefit } from './services/calculator';
import { EarningRecord, UserInputs, CalculationResult } from './types';

function App() {
  const [earnings, setEarnings] = useState<EarningRecord[]>([]);
  
  // Default Inputs
  const [inputs, setInputs] = useState<UserInputs>({
    birthMonth: 6,
    birthYear: 1965,
    projectedSalary: 85000,
    benefitStartMonth: 1,
    benefitStartYear: 2032 // 1965 + 67
  });

  const [result, setResult] = useState<CalculationResult | null>(null);

  // Auto-calculate when inputs or earnings change
  useEffect(() => {
    if (earnings.length > 0) {
      const res = calculateBenefit(earnings, inputs);
      setResult(res);
    } else {
      setResult(null);
    }
  }, [earnings, inputs]);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-600 p-2 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Social Security Planner</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Gemini
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg mb-6">
               <p className="text-sm text-blue-800">
                 <strong>How it works:</strong> Upload your earnings history CSV, set your projected retirement date, and see your estimated monthly benefit instantly.
               </p>
            </div>

            <FileUpload 
              onDataLoaded={setEarnings} 
              earnings={earnings} 
            />
            
            <InputForm 
              inputs={inputs} 
              setInputs={setInputs} 
            />
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {result ? (
              <Results result={result} inputs={inputs} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center min-h-[400px]">
                <div className="bg-slate-50 p-4 rounded-full mb-4">
                  <Calculator className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700 mb-2">No Data Yet</h3>
                <p className="text-slate-500 max-w-xs mx-auto">
                  Upload your earnings history or load sample data to see your benefit calculation.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;
