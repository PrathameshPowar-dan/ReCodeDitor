import React from 'react'
import RunButton from './RunButton';
import ThemeSelector from './ThemeSelector';

async function EditorPanel() {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 sm:p-4 h-[500px] sm:h-[600px] overflow-hidden">
      <div className="w-full flex items-center justify-around mb-3 sm:mb-4 flex-wrap gap-2">
          <ThemeSelector />
          <span className="h-fit text-base px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md block">JavaScript</span>
          <RunButton />
      </div>

      <div className="bg-gray-900 rounded-lg p-3 sm:p-4 h-full overflow-auto">
        <div className="font-mono text-sm text-gray-400">
          <div className="text-gray-500 mb-3 sm:mb-4">// Start coding here...</div>
          <div className="text-blue-400">function</div>
          <div className="text-yellow-300 ml-2 sm:ml-4">welcome</div>
          <div className="text-gray-200">() {`{`}</div>
          <div className="text-purple-400 ml-4 sm:ml-8">return</div>
          <div className="text-green-300 ml-6 sm:ml-12">"Hello, CodeCraft!"</div>
          <div className="text-gray-200">{`}`}</div>
        </div>
      </div>
    </div>
  )
}

export default EditorPanel;