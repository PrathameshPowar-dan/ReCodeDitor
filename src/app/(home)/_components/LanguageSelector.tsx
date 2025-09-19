"use client"
import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

function LanguageSelector({ hasAccess }: { hasAccess: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleLanguageSelect = () => {
    setIsOpen(false) // Close dropdown after selecting a language
  }

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-lg border border-gray-700/50 hover:border-blue-500/50 bg-gray-800/60 hover:bg-blue-600/20 transition-all duration-300 shadow-sm w-full sm:w-auto justify-center"
      >
        <span className="text-sm font-medium text-gray-300 group-hover:text-white hidden sm:block">JavaScript</span>
        <span className="text-sm font-medium text-gray-300 group-hover:text-white sm:hidden">JS</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 group-hover:text-blue-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div
        className={`absolute top-full left-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-lg rounded-lg border border-gray-700/50 shadow-lg transition-all duration-300 z-50 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="p-0.5">
          <div className="text-xs text-gray-500 px-3 py-2">Select Language</div>
          <button
            onClick={handleLanguageSelect}
            className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-blue-600/20 hover:text-white rounded-md transition-colors"
          >
            <span className='hidden md:block'>JavaScript</span>
            <span className='md:hidden'>JS</span>
          </button>
          <button
            onClick={handleLanguageSelect}
            className="w-full text-left px-3 py-2 text-xs text-gray-300 hover:bg-blue-600/20 hover:text-white rounded-md transition-colors"
          >
            <span className='hidden md:block'>TypeScript</span>
            <span className='md:hidden'>TS</span>
          </button>
          <button
            onClick={hasAccess ? handleLanguageSelect : undefined}
            className={`w-full text-left px-3 py-2 text-xs ${hasAccess
                ? 'text-gray-300 hover:bg-blue-600/20 hover:text-white cursor-pointer'
                : 'text-gray-500 cursor-not-allowed'
              } rounded-md transition-colors`}
          >
            <span className='hidden md:block'>Python</span>
            <span className='md:hidden'>PY</span>
            {!hasAccess && <span className="ml-1 text-xs">(Pro)</span>}
          </button>
          <button
            onClick={hasAccess ? handleLanguageSelect : undefined}
            className={`w-full text-left px-3 py-2 text-xs ${hasAccess
                ? 'text-gray-300 hover:bg-blue-600/20 hover:text-white cursor-pointer'
                : 'text-gray-500 cursor-not-allowed'
              } rounded-md transition-colors`}
          >
            <span className='hidden md:block'>Java</span>
            <span className='md:hidden'>JAVA</span>
            {!hasAccess && <span className="ml-1 text-xs">(Pro)</span>}
          </button>
        </div>
      </div>
    </div>
  )
}

export default LanguageSelector