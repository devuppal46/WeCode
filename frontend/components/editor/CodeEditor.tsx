"use client"

import Editor from "@monaco-editor/react"
import { useRef, useState, useCallback } from "react"
import {
  Copy,
  Check,
  WrapText,
  ChevronDown,
  FileCode2,
} from "lucide-react"

// ─── Language config ───────────────────────────────────────────────────────────
export const LANGUAGES = [
  { value: "javascript", label: "JavaScript", ext: "js" },
  { value: "python", label: "Python", ext: "py" },
  { value: "java", label: "Java", ext: "java" },
  { value: "cpp", label: "C++", ext: "cpp" },
] as const

export type LanguageValue = (typeof LANGUAGES)[number]["value"]

interface CodeEditorProps {
  code: string
  language: string
  onChange: (value: string) => void
  onLanguageChange?: (lang: string) => void
  userName?: string
}

// ─── Language Badge color map ──────────────────────────────────────────────────
const LANG_COLORS: Record<string, string> = {
  javascript: "#f7df1e",
  typescript: "#3178c6",
  python: "#3572a5",
  java: "#b07219",
  cpp: "#f34b7d",
  c: "#555555",
  go: "#00add8",
  rust: "#dea584",
  kotlin: "#a97bff",
  swift: "#f05138",
  sql: "#e38c00",
  markdown: "#083fa1",
  html: "#e34c26",
  css: "#563d7c",
  json: "#292929",
  yaml: "#cb171e",
  shell: "#89e051",
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function CodeEditor({
  code,
  language,
  onChange,
  onLanguageChange,
  userName = "You",
}: CodeEditorProps) {
  const editorRef = useRef<any>(null)
  const [copied, setCopied] = useState(false)
  const [wordWrap, setWordWrap] = useState<"on" | "off">("on")
  const [langMenuOpen, setLangMenuOpen] = useState(false)

  const currentLang = LANGUAGES.find((l) => l.value === language) ?? LANGUAGES[0]
  const dotColor = LANG_COLORS[language] ?? "#888"

  // ── Editor mount ──────────────────────────────────────────────────────────
  function handleEditorDidMount(editor: any) {
    editorRef.current = editor
    editor.focus()
  }

  // ── Copy ──────────────────────────────────────────────────────────────────
  const handleCopy = useCallback(() => {
    const value = editorRef.current?.getValue() ?? code
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [code])

  // ── Language change ───────────────────────────────────────────────────────
  const handleLangSelect = useCallback(
    (lang: string) => {
      onLanguageChange?.(lang)
      setLangMenuOpen(false)
    },
    [onLanguageChange]
  )

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] overflow-hidden">

      {/* ── Toolbar ───────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#252526] border-b border-[#3c3c3c] shrink-0 select-none">

        {/* Left: file tab */}
        <div className="flex items-center gap-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e1e] border-t-2 rounded-t text-xs text-zinc-300 font-mono"
            style={{ borderTopColor: dotColor }}>
            <FileCode2 className="w-3.5 h-3.5" style={{ color: dotColor }} />
            <span>main.{currentLang.ext}</span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-1">

          {/* Language selector */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen((v) => !v)}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium text-zinc-300 hover:bg-zinc-700/60 transition-colors"
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: dotColor }}
              />
              {currentLang.label}
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {/* Dropdown */}
            {langMenuOpen && (
              <>
                {/* Overlay to close */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLangMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 z-50 w-44 rounded-lg bg-[#2d2d2d] border border-[#3c3c3c] shadow-2xl py-1 overflow-hidden overflow-y-auto max-h-72">
                  {LANGUAGES.map((lang) => {
                    const active = lang.value === language
                    return (
                      <button
                        key={lang.value}
                        onClick={() => handleLangSelect(lang.value)}
                        className={`w-full flex items-center gap-2.5 px-3 py-1.5 text-left text-xs transition-colors ${active
                            ? "bg-blue-600/20 text-blue-300"
                            : "text-zinc-300 hover:bg-white/5"
                          }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: LANG_COLORS[lang.value] ?? "#888" }}
                        />
                        {lang.label}
                        <span className="ml-auto text-zinc-600 font-mono text-[10px]">
                          .{lang.ext}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Separator */}
          <div className="w-px h-4 bg-zinc-700 mx-1" />

          {/* Word-wrap toggle */}
          <button
            title={wordWrap === "on" ? "Disable word wrap" : "Enable word wrap"}
            onClick={() => setWordWrap((w) => (w === "on" ? "off" : "on"))}
            className={`p-1.5 rounded transition-colors ${wordWrap === "on"
                ? "text-blue-400 bg-blue-500/10"
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/5"
              }`}
          >
            <WrapText className="w-3.5 h-3.5" />
          </button>

          {/* Copy */}
          <button
            title="Copy code"
            onClick={handleCopy}
            className="p-1.5 rounded text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* ── Monaco Editor ─────────────────────────────────────────────────── */}
      {/*
        key={language} forces Monaco to fully remount when the language changes,
        avoiding stale tokenizer state. Only `language` is passed (no
        `defaultLanguage`) so Monaco stays in controlled mode.
      */}
      <div className="flex-1 overflow-hidden">
        <Editor
          key={language}
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(v) => onChange(v ?? "")}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            padding: { top: 16, bottom: 16 },
            lineNumbersMinChars: 3,
            renderLineHighlight: "gutter",
            bracketPairColorization: { enabled: true },
            tabSize: 2,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            formatOnPaste: true,
            formatOnType: false,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
          }}
        />
      </div>

      {/* ── Status bar ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 py-0.5 bg-[#007acc] shrink-0">
        <span className="text-[10px] text-white/80 font-medium">
          WeCode · {userName}
        </span>
        <div className="flex items-center gap-3 text-[10px] text-white/70">
          <span>Ln 1, Col 1</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span className="font-medium text-white/90">{currentLang.label}</span>
        </div>
      </div>
    </div>
  )
}