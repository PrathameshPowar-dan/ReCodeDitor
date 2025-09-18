import React from 'react'
import { ChevronDown } from 'lucide-react'

function LanguageSelector({hasAccess}: {hasAccess: boolean}) {
  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700/50 hover:border-blue-500/50 bg-gray-800/60 hover:bg-blue-600/20 transition-all duration-300 shadow-sm">
        <span className="text-sm font-medium text-gray-300 group-hover:text-white">JavaScript</span>
        <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-300" />
      </button>
      
      <div className="absolute top-full left-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-lg rounded-lg border border-gray-700/50 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <div className="p-2">
          <div className="text-xs text-gray-500 px-3 py-2">Select Language</div>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-blue-600/20 hover:text-white rounded-md transition-colors">
            JavaScript
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-blue-600/20 hover:text-white rounded-md transition-colors">
            TypeScript
          </button>
          <button className={`w-full text-left px-3 py-2 text-sm ${hasAccess ? 'text-gray-300 hover:bg-blue-600/20 hover:text-white' : 'text-gray-500'} rounded-md transition-colors`}>
            Python {!hasAccess && '(Pro)'}
          </button>
          <button className={`w-full text-left px-3 py-2 text-sm ${hasAccess ? 'text-gray-300 hover:bg-blue-600/20 hover:text-white' : 'text-gray-500'} rounded-md transition-colors`}>
            Java {!hasAccess && '(Pro)'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelector