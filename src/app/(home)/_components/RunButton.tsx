import React from 'react'
import { Play } from 'lucide-react'

function RunButton() {
  return (
    <div>
      <button className="flex items-center gap-1 px-1 py-1 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-500/50 text-white transition-all duration-300 shadow-md hover:shadow-lg group">
        <Play className="w-3 h-3 fill-white group-hover:scale-110 transition-transform" />
        <span className="text-xs font-medium">Run Code</span>
      </button>
    </div>
  )
}

export default RunButton