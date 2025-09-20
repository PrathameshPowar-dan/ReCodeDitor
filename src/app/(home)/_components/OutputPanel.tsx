"use client"
import { Terminal } from 'lucide-react'
import React from 'react'

function OutputPanel() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 h-[500px] sm:h-[480px] overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="w-4 h-4 text-blue-400" />
        <h2 className="text-lg font-semibold text-gray-200">Output</h2>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4 h-full overflow-auto font-mono text-sm">
        <div className="text-gray-400">// Output will appear here after running your code</div>
        <div className="mt-4 text-green-300">$ Ready to execute code...</div>
      </div>
    </div>
  )
}

export default OutputPanel