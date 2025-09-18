import React from 'react'

function OutputPanel() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 h-[600px] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Output</h2>
        <div className="flex items-center gap-2">
          <button className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-md hover:bg-gray-600/50 transition-colors">
            Clear
          </button>
        </div>
      </div>
      
      <div className="bg-gray-900 rounded-lg p-4 h-full overflow-auto font-mono text-sm">
        <div className="text-gray-400">// Output will appear here after running your code</div>
        <div className="mt-4 text-green-300">$ Ready to execute code...</div>
      </div>
    </div>
  )
}

export default OutputPanel