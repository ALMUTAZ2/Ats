
import React, { useState } from 'react';
import { ApiResponse } from '../types.ts';

export const StatusTerminal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);

  const checkStatus = async () => {
    setLoading(true);
    // Simulating the fetch call to FastAPI /status
    setTimeout(() => {
      setResponse({
        message: "✅ ATS-Beater API is running successfully",
        timestamp: new Date().toLocaleTimeString(),
        status: 'success'
      });
      setLoading(false);
    }, 800);
  };

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-700/50 border-b border-slate-700">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Live API Simulator</span>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">ATS-Beater API</h2>
          <p className="text-slate-400 text-sm">Interactive diagnostic tool for your backend service</p>
        </div>

        <div className="flex justify-center">
          <button
            onClick={checkStatus}
            disabled={loading}
            className={`px-8 py-3 rounded-full font-semibold transition-all transform active:scale-95 flex items-center space-x-2 ${
              loading 
                ? 'bg-blue-600/50 cursor-not-allowed text-white/70' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25'
            }`}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Checking...</span>
              </>
            ) : (
              <span>Check API Status</span>
            )}
          </button>
        </div>

        <div className="mt-4">
          <div className="bg-black/40 rounded-lg p-4 code-font text-sm min-h-[100px] border border-slate-700 flex flex-col justify-center">
            {response ? (
              <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-start">
                  <span className="text-green-400">{response.message}</span>
                  <span className="text-slate-500 text-xs">{response.timestamp}</span>
                </div>
                <div className="text-slate-500 text-xs pt-2 border-t border-slate-800">
                  <span className="text-blue-400">GET</span> /status <span className="text-green-500">200 OK</span>
                </div>
              </div>
            ) : (
              <div className="text-slate-600 flex items-center justify-center">
                {!loading && <span>Click the button to ping the API...</span>}
                {loading && <span className="animate-pulse-fast italic">Awaiting response from server...</span>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
