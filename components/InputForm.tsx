import React from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { UserInputs } from '../types';
import { MONTHS } from '../constants';

interface InputFormProps {
  inputs: UserInputs;
  setInputs: React.Dispatch<React.SetStateAction<UserInputs>>;
}

const InputForm: React.FC<InputFormProps> = ({ inputs, setInputs }) => {
  
  const handleChange = (field: keyof UserInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Explicit styling to ensure white background and readable text regardless of browser theme
  const inputStyle = { backgroundColor: '#ffffff', color: '#0f172a' }; 

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Personal Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-purple-100 p-2 rounded-lg">
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">2. Personal Details</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Birth Month</label>
            <select 
              value={inputs.birthMonth}
              onChange={(e) => handleChange('birthMonth', Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white text-slate-900"
              style={inputStyle}
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Birth Year</label>
            <input 
              type="number" 
              value={inputs.birthYear}
              onChange={(e) => handleChange('birthYear', Number(e.target.value))}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none bg-white text-slate-900"
              style={inputStyle}
              min="1940" max="2010"
            />
          </div>
        </div>
      </div>

      {/* Benefit Strategy */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center space-x-2 mb-4">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">3. Benefit Strategy</h2>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Start Month</label>
              <select 
                value={inputs.benefitStartMonth}
                onChange={(e) => handleChange('benefitStartMonth', Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-900"
                style={inputStyle}
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Start Year</label>
              <input 
                type="number" 
                value={inputs.benefitStartYear}
                onChange={(e) => handleChange('benefitStartYear', Number(e.target.value))}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-900"
                style={inputStyle}
                min={inputs.birthYear + 62} max={inputs.birthYear + 70}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Projected Future Income (Annual)</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-500">$</span>
              <input 
                type="number" 
                value={inputs.projectedSalary}
                onChange={(e) => handleChange('projectedSalary', Number(e.target.value))}
                className="w-full pl-6 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-slate-900"
                style={inputStyle}
                placeholder="100000"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Estimated salary for future working years until benefits start.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputForm;