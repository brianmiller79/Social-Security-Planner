import React, { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { EarningRecord } from '../types';
import { SAMPLE_CSV } from '../constants';

interface FileUploadProps {
  onDataLoaded: (data: EarningRecord[]) => void;
  earnings: EarningRecord[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded, earnings }) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseCSV = (text: string) => {
    setError(null);
    if (!text) {
        setError("File content is empty.");
        return;
    }
    
    // Handle different line endings (windows/unix)
    const lines = text.trim().split(/\r?\n/);
    if (lines.length === 0) {
        setError("File appears to be empty.");
        return;
    }

    const records: EarningRecord[] = [];
    
    // Heuristic: Check if first line is a header
    const firstLineFirstCol = lines[0].split(',')[0].trim().toLowerCase();
    const isHeader = isNaN(Number(firstLineFirstCol)) || firstLineFirstCol.includes('year');
    const startIndex = isHeader ? 1 : 0;

    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const rawParts = line.split(',');
      if (rawParts.length < 2) continue;

      // Heuristic: First column is year, rest is amount
      // This handles cases like: 2023, "100,000" where split(',') creates 3 parts
      const yearStr = rawParts[0].trim().replace(/['"]/g, '');
      const amountStr = rawParts.slice(1).join('').trim().replace(/["$,]/g, ''); // Remove quotes, $, commas

      const year = parseInt(yearStr);
      const amount = parseFloat(amountStr);

      if (!isNaN(year) && !isNaN(amount) && year > 1900 && year < 2100) {
        records.push({ year, amount });
      }
    }
    
    if (records.length === 0) {
        setError("No valid earnings records found. Expected format: Year, Earnings (e.g. 1990, 25000)");
        onDataLoaded([]); 
    } else {
        onDataLoaded(records);
        setError(null);
    }
  };

  const handleFile = (file: File) => {
      // Basic validation
      if (file.type && file.type !== "text/csv" && file.type !== "application/vnd.ms-excel" && !file.name.endsWith('.csv')) {
          setError("Please upload a valid CSV file.");
          return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        parseCSV(text);
      };
      reader.onerror = () => setError("Failed to read file.");
      reader.readAsText(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
    // Reset value to allow re-uploading the same file if needed
    e.target.value = '';
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const loadSampleData = () => {
    setError(null);
    parseCSV(SAMPLE_CSV);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <div className="flex items-center space-x-2 mb-4">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileText className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">1. Earnings History</h2>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-slate-600">
          Upload a CSV file containing your Social Security earnings history. 
          Format: <code>Year, Earnings</code>
        </p>

        <label 
          className={`
            border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center transition-colors cursor-pointer block
            ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:bg-slate-50'}
            ${error ? 'border-red-300 bg-red-50' : ''}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input 
            type="file" 
            onChange={handleChange}
            accept=".csv,text/csv"
            className="hidden"
          />
          <Upload className={`w-8 h-8 mb-2 ${dragActive ? 'text-blue-500' : 'text-slate-400'}`} />
          <span className="text-sm font-medium text-slate-600">
             {dragActive ? "Drop CSV file here" : "Click to upload CSV"}
          </span>
          <span className="text-xs text-slate-400 mt-1">or drag and drop here</span>
        </label>
        
        {error && (
            <div className="flex items-start p-3 bg-red-50 text-red-700 rounded-md text-sm">
                <AlertCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
            </div>
        )}

        <div className="flex items-center justify-between pt-2">
           <button 
            onClick={loadSampleData}
            className="text-sm text-blue-600 font-medium hover:underline"
          >
            Load Sample Data
          </button>
          
          {earnings.length > 0 && !error && (
            <div className="flex items-center text-emerald-600 text-sm font-medium">
              <CheckCircle className="w-4 h-4 mr-1" />
              {earnings.length} records loaded
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;