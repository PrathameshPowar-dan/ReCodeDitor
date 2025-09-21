"use client"
import React, { useEffect, useState } from 'react'
import RunButton from './RunButton';
import ThemeSelector from './ThemeSelector';
import { useStore } from "@/store/storeContext"
import { defineMonacoThemes, LANGUAGE_CONFIG } from '../_constants';
import { Editor } from '@monaco-editor/react';
import { motion } from 'framer-motion';
import { Palette, RotateCcwIcon, ShareIcon, TypeIcon } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

function EditorPanel() {
  const clerk = useClerk();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const { language, theme, fontSize, getCode, editor, setFontSize, setEditor } = useStore();
  const [isMounted, setIsMounted] = useState(false)
  const currentLanguageObj = LANGUAGE_CONFIG[language];
  const [title, setTitle] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const createSnippet = useMutation(api.snippets.createSnippet)

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language]?.defaultCode;
    if (editor) editor.setValue(newCode);
  }, [language, editor])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language]?.defaultCode;
    if (editor) {
      editor.setValue(defaultCode);
      localStorage.setItem(`editor-code-${language}`, defaultCode);
    }
  }

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  }

  const handleFontSizeChange = (e: number) => {
    const newSize = e;
    setFontSize(newSize);
    localStorage.setItem("editor-font-size", newSize.toString());
  }

  if (!isMounted) {
    return (
      <div className="bg-gray-800/50 flex items-center justify-center backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 sm:p-4 h-[500px] sm:h-[480px] overflow-hidden">
        <button className="w-20 sm:w-28 group relative flex items-center gap-1.5 sm:gap-2 px-2 py-1.5 sm:px-2 sm:py-1 rounded-lg">
          <Palette className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
          <span className="text-gray-300 min-w-[60px] sm:min-w-[80px] text-left text-xs sm:text-sm">
            Loading...
          </span>
        </button>
      </div>
    )
  }

  return (
    <div className="bg-gray-800/50 flex flex-col backdrop-blur-sm rounded-xl border border-gray-700/50 p-3 sm:p-4 h-[500px] sm:h-[480px] overflow-hidden">
      <div className="w-full flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
        <ThemeSelector />
        <div className='flex items-center gap-1 md:gap-3'>
          <span className="h-fit text-base px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md block">{currentLanguageObj.label}</span>
          <RunButton />
        </div>
      </div>

      {clerk.loaded && (<Editor
        className='h-full'
        language={LANGUAGE_CONFIG[language].monacoLanguage}
        onChange={handleEditorChange}
        theme={theme}
        beforeMount={defineMonacoThemes}
        onMount={(editor) => setEditor(editor)}
        options={{
          minimap: { enabled: true },
          fontSize,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 10, bottom: 10 },
          renderWhitespace: "selection",
          fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
          fontLigatures: true,
          cursorBlinking: "smooth",
          smoothScrolling: true,
          contextmenu: true,
          renderLineHighlight: "all",
          lineHeight: 1.1,
          letterSpacing: 0.3,
          roundedSelection: true,
          scrollbar: {
            verticalScrollbarSize: 5,
            horizontalScrollbarSize: 5,
          },
        }}
      />)}

      {!clerk.loaded && (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-gray-400">Loading editor...</div>
        </div>
      )}

      <div className="w-full m-auto flex flex-row items-center justify-between mt-3 sm:mt-4 mb-3 sm:mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-3 border border-gray-600/50 p-0.5 rounded-lg bg-gray-700/30">
          <TypeIcon className="size-4 text-gray-400" />
          <input
            type="range"
            min="7"
            max="24"
            value={fontSize}
            onChange={(e) => handleFontSizeChange(parseInt(e.target.value))}
            className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
          />
          <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
            {fontSize}
          </span>
        </div>

        <div className='gap-2 flex'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRefresh}
            className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
            aria-label="Reset to default code"
          >
            <RotateCcwIcon className="size-3 text-gray-400" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsShareDialogOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
          >
            <ShareIcon className="size-4 text-white" />
            <span className="text-sm font-medium text-white ">Share</span>
          </motion.button>
        </div>
      </div>
      {isShareDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <h2 className="text-lg font-semibold mb-4">Share Your Code</h2>
            <p className="text-sm text-gray-600 mb-4">Share your code snippet with others using the link below:</p>
            <input
              type="text"
              // value={shareableLink}
              readOnly
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsShareDialogOpen(false)}
                className="bg-blue-500 text-white rounded-md px-4 py-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EditorPanel;