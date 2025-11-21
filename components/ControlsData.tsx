import React, { useState, useEffect } from 'react';
import { GraphNodeData } from '../types';
import { AlertCircle } from 'lucide-react';

interface ControlsDataProps {
  currentData: GraphNodeData[];
  onDataChange: (data: GraphNodeData[]) => void;
}

export const ControlsData: React.FC<ControlsDataProps> = ({ currentData, onDataChange }) => {
  const [jsonInput, setJsonInput] = useState(JSON.stringify(currentData, null, 2));
  const [error, setError] = useState<string | null>(null);

  const handleJsonUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setJsonInput(val);
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) {
        onDataChange(parsed);
        setError(null);
      }
    } catch (err) {
      setError("Invalid JSON");
    }
  };

  // Sync local JSON state if parent data changes externally
  useEffect(() => {
    setJsonInput(JSON.stringify(currentData, null, 2));
  }, [currentData]);

  return (
    <section className="flex-1 flex flex-col h-full">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex justify-between items-center">
            <span>JSON Data</span>
            {error && <span className="text-rose-500 flex items-center gap-1 normal-case"><AlertCircle className="w-3 h-3"/> Invalid JSON</span>}
        </h3>
        <textarea 
            className={`w-full flex-1 p-3 text-xs font-mono border rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${error ? 'border-rose-300 bg-rose-50' : 'border-slate-200'}`}
            value={jsonInput}
            onChange={handleJsonUpdate}
            spellCheck={false}
            style={{ minHeight: '300px' }}
        />
        <p className="text-[10px] text-slate-400 mt-2">
            Format: Array of objects with <code>id</code> (string) and <code>parentIds</code> (string[]).
        </p>
    </section>
  );
};