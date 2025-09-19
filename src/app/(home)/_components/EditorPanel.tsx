import React from 'react'
import RunButton from './RunButton';
import ThemeSelector from './ThemeSelector';

async function EditorPanel() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-4 h-[600px] overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ThemeSelector />
          <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md">JavaScript</span>
          <RunButton />
        </div>
      </div>

      <div className="bg-gray-900 rounded-lg p-4 h-full overflow-auto">
        <div className="font-mono text-sm text-gray-400">
          <div className="text-gray-500 mb-4">// Start coding here...</div>
          <div className="text-blue-400">function</div>
          <div className="text-yellow-300 ml-4">welcome</div>
          <div className="text-gray-200">() {`{`}</div>
          <div className="text-purple-400 ml-8">return</div>
          <div className="text-green-300 ml-12">"Hello, CodeCraft!"</div>
          <div className="text-gray-200">{`}`}</div>
        </div>
      </div>
    </div>
  )
}

export default EditorPanel;