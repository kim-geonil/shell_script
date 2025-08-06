export interface EditorTab {
  id: string;
  title: string;
  content: string;
  language: string;
  isDirty: boolean;
  filePath?: string;
  isActive: boolean;
  createdAt: string;
  modifiedAt: string;
}

export interface EditorState {
  tabs: EditorTab[];
  activeTabId: string | null;
  isFullscreen: boolean;
  theme: 'light' | 'dark' | 'high-contrast';
  fontSize: number;
  wordWrap: boolean;
  minimap: boolean;
  lineNumbers: boolean;
  autoSave: boolean;
  autoSaveDelay: number; // in milliseconds
}

export interface EditorSettings {
  theme: string;
  fontSize: number;
  fontFamily: string;
  tabSize: number;
  insertSpaces: boolean;
  wordWrap: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
  minimap: {
    enabled: boolean;
    side: 'left' | 'right';
    showSlider: 'always' | 'mouseover';
  };
  lineNumbers: 'on' | 'off' | 'relative' | 'interval';
  renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
  rulers: number[];
  autoIndent: 'none' | 'keep' | 'brackets' | 'advanced' | 'full';
  formatOnSave: boolean;
  formatOnPaste: boolean;
  cursorStyle: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
}

export interface CodeCompletion {
  label: string;
  kind: string;
  detail?: string;
  documentation?: string;
  insertText: string;
  range?: {
    startLineNumber: number;
    startColumn: number;
    endLineNumber: number;
    endColumn: number;
  };
}

export interface EditorError {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
  message: string;
  severity: 'error' | 'warning' | 'info' | 'hint';
}

export interface ScriptValidationResult {
  isValid: boolean;
  errors: EditorError[];
  warnings: EditorError[];
  suggestions: EditorError[];
}