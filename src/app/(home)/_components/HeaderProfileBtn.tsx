import React from 'react'
import { User } from 'lucide-react'

function HeaderProfileBtn() {
  return (
    <div>
      <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700/50 hover:border-blue-500/50 bg-gray-800/60 hover:bg-blue-600/20 transition-all duration-300 shadow-sm group">
        <User className="w-4 h-4 text-gray-400 group-hover:text-blue-300" />
        <span className="text-sm font-medium text-gray-300 group-hover:text-white">Profile</span>
      </button>
    </div>
  )
}

export default HeaderProfileBtn