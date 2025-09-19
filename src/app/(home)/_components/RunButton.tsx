import React from 'react'
import { Play } from 'lucide-react'

function RunButton() {
  return (
    <div>
      <button className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 border border-blue-500/50 text-white transition-all duration-300 shadow-md hover:shadow-lg group">
        <Play className="w-3 h-3 sm:w-4 sm:h-4 fill-white group-hover:scale-110 transition-transform" />
        <span className="text-base font-medium hidden sm:block">Run Code</span>
        <span className="text-sm font-medium sm:hidden">Run</span>
      </button>
    </div>
  )
}

export default RunButton