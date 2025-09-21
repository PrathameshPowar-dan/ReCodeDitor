"use client"
import React from 'react'
import { Play } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { useStore } from '@/store/storeContext';

function RunButton() {
  const { user } = useUser();
  const { runCode, language, isRunning, executionResult } = useStore();

  const handleRunClick = async () => {
    if (!user) {
      alert("Please sign in to run code.");
      return;
    }
    await runCode();

    if (user) {
      // Handle successful code execution
    }
  };
  return (
    <div>
      <button className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-500/50 text-white transition-all duration-300 shadow-md hover:shadow-lg group" onClick={handleRunClick}
      disabled={isRunning}
      >
        <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-white group-hover:scale-110 transition-transform" />
        <span className="text-base font-medium hidden sm:block">{isRunning ? "Executing..." : "Run Code"}</span>
        <span className="text-sm font-medium sm:hidden">{isRunning ? "Executing..." : "Run"}</span>
      </button>
    </div>
  );
}

export default RunButton