"use client"
import { useStore } from '@/store/storeContext'
import { AlertTriangle, CheckCircle, Clock, Copy, Terminal } from 'lucide-react'
import React, { useState } from 'react'

function OutputPanel() {
  const { output, error, isRunning } = useStore();
  const [isCopied, setIsCopied] = useState(false);

  const hasContent = true;
  const handleCopy = async () => {
    if (!hasContent) return;
    await navigator.clipboard.writeText(output || error || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  }

  return (
    <div className="bg-gray-800/50 flex flex-col backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 sm:p-4 h-[500px] sm:h-[480px] overflow-hidden">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className='flex items-center gap-2'>
          <Terminal className="w-4 h-4 text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-200">Output</h2>

        </div>

        {hasContent && (
          <button
            onClick={handleCopy}
            className='flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2'
          >
            {isCopied ? (
              <>
                <CheckCircle className="w-3.5 h-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy
              </>
            )}
          </button>
        )}
      </div>

      <div className="h-full bg-gray-900 rounded-lg p-4 overflow-auto font-mono text-sm">
        <div className="space-y-4 animate-pulse">
          {isRunning ? (
            <>
            <div className="space-y-2">
              <div className="h-4 bg-gray-800/50 rounded w-3/4" />
              <div className="h-4 bg-gray-800/50 rounded w-1/2" />
              <div className="h-4 bg-gray-800/50 rounded w-5/6" />
            </div>
            <div className="space-y-2 pt-4">
                <div className="h-4 bg-gray-800/50 rounded w-2/3" />
                <div className="h-4 bg-gray-800/50 rounded w-4/5" />
                <div className="h-4 bg-gray-800/50 rounded w-3/4" />
              </div>
            </>

          ) : error ? (
            <div className="flex items-start gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <div className="font-medium">Execution Error</div>
                <pre className="whitespace-pre-wrap text-red-400/80">{error}</pre>
              </div>
            </div>
          ) : output ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 mb-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Execution Successful</span>
              </div>
              <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-center">Run your code to see the output here...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default OutputPanel