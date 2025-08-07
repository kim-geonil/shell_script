import React, { useEffect, useRef, useState } from 'react';

interface MonacoEditorProps {
  scriptId?: string;
  initialContent?: string;
  className?: string;
  height?: string | number;
  language?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  onChange?: (content: string) => void;
  onSave?: (content: string) => void;
}

export default function MonacoEditor({
  scriptId,
  initialContent = '',
  className,
  height = '100%',
  language = 'bash',
  theme = 'dark',
  readOnly = false,
  onChange,
  onSave
}: MonacoEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMonacoLoaded, setIsMonacoLoaded] = useState(false);
  const [content, setContent] = useState(initialContent);
  const editorRef = useRef<any>(null);
  
  // Monaco Editor 동적 로딩
  useEffect(() => {
    const loadMonaco = async () => {
      try {
        console.log('Monaco Editor 로딩 중...');
        
        // Monaco Editor 동적 import
        const monaco = await import('monaco-editor');
        
        if (!containerRef.current) return;

        console.log('Monaco Editor 초기화 중...');

        // 다크 테마 정의
        monaco.editor.defineTheme('ncuscript-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
            { token: 'string', foreground: '98d982' },
            { token: 'number', foreground: '79b8ff' },
            { token: 'keyword', foreground: 'f97583' }
          ],
          colors: {
            'editor.background': '#1a1a1a',
            'editor.foreground': '#f6f8fa',
            'editorLineNumber.foreground': '#6a737d',
            'editorCursor.foreground': '#f6f8fa'
          }
        });

        // 에디터 생성
        const editor = monaco.editor.create(containerRef.current, {
          value: content,
          language: language,
          theme: theme === 'dark' ? 'ncuscript-dark' : 'vs',
          readOnly: readOnly,
          automaticLayout: true,
          fontSize: 14,
          lineNumbers: 'on',
          minimap: { enabled: false }, // 메모리 오류 방지를 위해 minimap 비활성화
          wordWrap: 'on',
          scrollBeyondLastLine: false,
          renderWhitespace: 'selection',
          tabSize: 2,
          insertSpaces: true,
          // 추가 최적화 설정
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          renderValidationDecorations: 'off'
        });

        editorRef.current = editor;
        setIsMonacoLoaded(true);

        console.log('Monaco Editor 초기화 완료');

        // 내용 변경 감지
        const disposable = editor.onDidChangeModelContent(() => {
          const newContent = editor.getValue();
          setContent(newContent);
          if (onChange) {
            onChange(newContent);
          }
        });

        // 키보드 단축키
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
          if (onSave) {
            onSave(editor.getValue());
          }
        });

        // 정리 함수 반환
        return () => {
          disposable.dispose();
          editor.dispose();
        };
      } catch (error) {
        console.error('Monaco Editor 로딩 실패:', error);
        setIsMonacoLoaded(false);
      }
    };

    const cleanup = loadMonaco();
    return () => {
      cleanup?.then(cleanupFn => cleanupFn?.());
    };
  }, []);

  // 초기 컨텐츠 업데이트
  useEffect(() => {
    setContent(initialContent);
    if (editorRef.current && isMonacoLoaded) {
      editorRef.current.setValue(initialContent);
    }
  }, [initialContent, isMonacoLoaded]);

  // Textarea fallback의 내용 변경 처리
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  // Textarea에서 Ctrl+S 처리
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      if (onSave) {
        onSave(content);
      }
    }
  };

  return (
    <div 
      className={`monaco-editor-container ${className || ''}`}
      style={{ 
        height: typeof height === 'string' ? height : `${height}px`,
        width: '100%',
        backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
        position: 'relative'
      }}
    >
      {/* Monaco Editor 컨테이너 */}
      <div
        ref={containerRef}
        style={{ 
          height: '100%', 
          width: '100%',
          display: isMonacoLoaded ? 'block' : 'none'
        }}
      />
      
      {/* Fallback Textarea - Monaco가 로드되지 않았을 때 */}
      {!isMonacoLoaded && (
        <div style={{ height: '100%', width: '100%', position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleTextareaChange}
            onKeyDown={handleTextareaKeyDown}
            readOnly={readOnly}
            style={{
              width: '100%',
              height: '100%',
              padding: '16px',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'Consolas, "Courier New", monospace',
              fontSize: '14px',
              lineHeight: '1.5',
              backgroundColor: theme === 'dark' ? '#1a1a1a' : '#ffffff',
              color: theme === 'dark' ? '#f6f8fa' : '#000000',
              tabSize: 2
            }}
            placeholder="스크립트를 입력하세요..."
            spellCheck={false}
          />
          
          {/* 로딩 표시 */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            fontSize: '12px',
            color: theme === 'dark' ? '#6a737d' : '#666666',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <div style={{
              width: '12px',
              height: '12px',
              border: '2px solid #4CAF50',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Monaco Editor 로딩 중...
          </div>
        </div>
      )}
    </div>
  );
}