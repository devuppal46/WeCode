"use client"

import Editor from "@monaco-editor/react"
import { useEffect, useRef } from "react"

interface CodeEditorProps {
  code: string
  language: string
  onChange: (value: string) => void
}

export default function CodeEditor({
  code,
  language,
  onChange,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null)

  // Handle editor mount
  function handleEditorDidMount(editor: any) {
    editorRef.current = editor

    // Optional: Focus editor automatically
    editor.focus()
  }

  // Handle code changes
  function handleChange(value: string | undefined) {
    onChange(value || "")
  }

  return (
    <div className="h-full w-full bg-zinc-900">
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        theme="vs-dark"
        value={code}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: "on",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          padding: { top: 12, bottom: 12 },
        }}
      />
    </div>
  )
}