"use client"
import React from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useStore } from '@/store/storeContext';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

function RunButton() {
  const { user } = useUser();
  const { runCode, language, isRunning } = useStore();
  const saveExecution = useMutation(api.codeExecutions.saveExecution);

  const handleRunClick = async () => {
    await runCode();

    const latest = useStore.getState().executionResult;
    
    if (user && latest) {
      await saveExecution({
        language,
        code: latest.code,
        output: latest.output || undefined,
        error: latest.error || undefined,
      });

      console.log("Execution saved.");
    }
  };
  return (
    <div>
      <button className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-500/50 text-white transition-all duration-300 shadow-md hover:shadow-lg group" onClick={handleRunClick}
        disabled={isRunning}
      >
        <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-white group-hover:scale-110 transition-transform" />
        <span className="text-base font-medium hidden sm:block">{isRunning ? "Executing..." : "Run Code"}</span>
        <span className="text-sm font-medium sm:hidden">{isRunning ? <RotateCcw className="w-5 h-5 animate-spin" /> : "Run"}</span>
      </button>
    </div>
  );
}

export default RunButton