import { useEffect, useRef, useState } from 'react';
import * as monaco from 'monaco-editor';
import { useAppDispatch, useEditor } from './redux';
import { updateTabContent, setActiveTab } from '../store/slices/editorSlice';
import { EditorSettings, EditorError, ScriptValidationResult } from '../types/editor';

interface UseMonacoEditorOptions {
  language?: string;
  theme?: string;
  readOnly?: boolean;
  automaticLayout?: boolean;
  minimap?: boolean;
  lineNumbers?: 'on' | 'off' | 'relative' | 'interval';
  wordWrap?: 'off' | 'on' | 'wordWrapColumn' | 'bounded';
  fontSize?: number;
  tabSize?: number;
}

export function useMonacoEditor(
  containerId: string,
  options: UseMonacoEditorOptions = {}
) {
  const dispatch = useAppDispatch();
  const editorState = useEditor();
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Default options
  const defaultOptions: monaco.editor.IStandaloneEditorConstructionOptions = {
    language: options.language || 'bash',
    theme: options.theme || 'vs-dark',
    readOnly: options.readOnly || false,
    automaticLayout: options.automaticLayout !== false,
    minimap: { 
      enabled: options.minimap !== false 
    },
    lineNumbers: options.lineNumbers || 'on',
    wordWrap: options.wordWrap || 'on',
    fontSize: options.fontSize || 14,
    tabSize: options.tabSize || 2,
    insertSpaces: true,
    renderWhitespace: 'selection',
    rulers: [80, 120],
    scrollBeyondLastLine: false,
    folding: true,
    foldingHighlight: true,
    showFoldingControls: 'always',
    renderLineHighlight: 'line',
    cursorBlinking: 'blink',
    cursorStyle: 'line',
    smoothScrolling: true,
    multiCursorModifier: 'ctrlCmd',
    formatOnPaste: true,
    formatOnType: true,
    suggestOnTriggerCharacters: true,
    acceptSuggestionOnEnter: 'on',
    quickSuggestions: true,
    parameterHints: { enabled: true },
    autoIndent: 'full',
    dragAndDrop: true,
    links: true,
    colorDecorators: true,
    contextmenu: true,
    mouseWheelZoom: true,
    find: {
      addExtraSpaceOnTop: false,
      autoFindInSelection: 'multiline',
      seedSearchStringFromSelection: 'selection',
    },
  };

  // Initialize Monaco Editor
  useEffect(() => {
    if (!containerRef.current) return;

    // Create editor instance
    const editor = monaco.editor.create(containerRef.current, defaultOptions);
    editorRef.current = editor;
    setIsEditorReady(true);

    // Set up event listeners
    const disposables = [
      editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        const activeTab = editorState.tabs.find(tab => tab.isActive);
        
        if (activeTab) {
          dispatch(updateTabContent({
            id: activeTab.id,
            content: value,
            isDirty: true
          }));
        }
      }),

      editor.onDidFocusEditorWidget(() => {
        // Handle editor focus
      }),

      editor.onDidBlurEditorWidget(() => {
        // Handle editor blur
      }),

      editor.onDidChangeCursorPosition((e) => {
        // Handle cursor position changes
        console.log('Cursor position:', e.position);
      }),
    ];

    // Cleanup function
    return () => {
      disposables.forEach(disposable => disposable.dispose());
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, [containerId, dispatch]);

  // Update editor content when active tab changes
  useEffect(() => {
    if (!editorRef.current || !isEditorReady) return;

    const activeTab = editorState.tabs.find(tab => tab.isActive);
    if (activeTab) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== activeTab.content) {
        editorRef.current.setValue(activeTab.content);
      }
      
      // Update language model
      const model = editorRef.current.getModel();
      if (model && model.getLanguageId() !== activeTab.language) {
        monaco.editor.setModelLanguage(model, activeTab.language);
      }
    }
  }, [editorState.tabs, editorState.activeTabId, isEditorReady]);

  // Update editor theme
  useEffect(() => {
    if (editorRef.current && isEditorReady) {
      monaco.editor.setTheme(editorState.theme === 'dark' ? 'vs-dark' : 'vs');
    }
  }, [editorState.theme, isEditorReady]);

  // Editor actions
  const actions = {
    getValue: () => editorRef.current?.getValue() || '',
    
    setValue: (value: string) => {
      if (editorRef.current) {
        editorRef.current.setValue(value);
      }
    },

    insertText: (text: string, position?: monaco.Position) => {
      if (!editorRef.current) return;
      
      const pos = position || editorRef.current.getPosition();
      if (pos) {
        editorRef.current.executeEdits('insert', [{
          range: {
            startLineNumber: pos.lineNumber,
            startColumn: pos.column,
            endLineNumber: pos.lineNumber,
            endColumn: pos.column
          },
          text
        }]);
      }
    },

    format: async () => {
      if (editorRef.current) {
        await editorRef.current.getAction('editor.action.formatDocument')?.run();
      }
    },

    find: (text: string) => {
      if (editorRef.current) {
        editorRef.current.getAction('actions.find')?.run();
      }
    },

    replace: () => {
      if (editorRef.current) {
        editorRef.current.getAction('editor.action.startFindReplaceAction')?.run();
      }
    },

    goToLine: (lineNumber: number) => {
      if (editorRef.current) {
        editorRef.current.revealLineInCenter(lineNumber);
        editorRef.current.setPosition({ lineNumber, column: 1 });
      }
    },

    toggleMinimap: () => {
      if (editorRef.current) {
        const currentOptions = editorRef.current.getOptions();
        editorRef.current.updateOptions({
          minimap: { enabled: !currentOptions.get(monaco.editor.EditorOption.minimap).enabled }
        });
      }
    },

    toggleWordWrap: () => {
      if (editorRef.current) {
        const currentWrap = editorRef.current.getOptions().get(monaco.editor.EditorOption.wordWrap);
        editorRef.current.updateOptions({
          wordWrap: currentWrap === 'on' ? 'off' : 'on'
        });
      }
    },

    setFontSize: (size: number) => {
      if (editorRef.current) {
        editorRef.current.updateOptions({ fontSize: size });
      }
    },

    focus: () => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
    },

    validateScript: (): ScriptValidationResult => {
      const content = editorRef.current?.getValue() || '';
      const errors: EditorError[] = [];
      const warnings: EditorError[] = [];
      const suggestions: EditorError[] = [];

      // Basic bash script validation
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        const lineNumber = index + 1;
        const trimmedLine = line.trim();
        
        // Check for missing shebang
        if (lineNumber === 1 && !trimmedLine.startsWith('#!')) {
          suggestions.push({
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: line.length + 1,
            message: 'Consider adding a shebang (#!/bin/bash) at the beginning',
            severity: 'info'
          });
        }

        // Check for common syntax issues
        if (trimmedLine.includes('if [') && !trimmedLine.includes(']')) {
          errors.push({
            startLineNumber: lineNumber,
            startColumn: 1,
            endLineNumber: lineNumber,
            endColumn: line.length + 1,
            message: 'Unclosed bracket in if statement',
            severity: 'error'
          });
        }

        // Check for unquoted variables
        const unquotedVarMatch = trimmedLine.match(/\$\w+(?!\s*[=\]])/);
        if (unquotedVarMatch) {
          warnings.push({
            startLineNumber: lineNumber,
            startColumn: line.indexOf(unquotedVarMatch[0]) + 1,
            endLineNumber: lineNumber,
            endColumn: line.indexOf(unquotedVarMatch[0]) + unquotedVarMatch[0].length + 1,
            message: 'Consider quoting variable to prevent word splitting',
            severity: 'warning'
          });
        }
      });

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions
      };
    },

    showValidationErrors: (result: ScriptValidationResult) => {
      if (!editorRef.current) return;

      const model = editorRef.current.getModel();
      if (!model) return;

      const markers = [
        ...result.errors.map(error => ({
          ...error,
          severity: monaco.MarkerSeverity.Error
        })),
        ...result.warnings.map(warning => ({
          ...warning,
          severity: monaco.MarkerSeverity.Warning
        })),
        ...result.suggestions.map(suggestion => ({
          ...suggestion,
          severity: monaco.MarkerSeverity.Info
        }))
      ];

      monaco.editor.setModelMarkers(model, 'validation', markers);
    }
  };

  return {
    containerRef,
    editor: editorRef.current,
    isEditorReady,
    actions
  };
}

export default useMonacoEditor;