import React, { useEffect, useRef, useState } from 'react';

interface MonacoEditorProps {
  scriptId?: string;
  initialContent?: string;
  className?: string;
  height?: string | number;
  language?: string;
  theme?: 'light' | 'dark';
  readOnly?: boolean;
  minimapEnabled?: boolean;
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
  minimapEnabled = true,
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

        // 고급 다크 테마 정의 (VS Code 스타일)
        monaco.editor.defineTheme('security-script-dark', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            // Bash specific highlighting - 더 선명한 색상
            { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
            { token: 'string', foreground: 'CE9178' },
            { token: 'string.escape', foreground: 'D7BA7D' },
            { token: 'string.filepath', foreground: 'F9E79F' },
            { token: 'string.backtick', foreground: 'F1C40F' },
            { token: 'string.invalid', foreground: 'F85149' },
            { token: 'number', foreground: 'B5CEA8' },
            
            // 키워드 - 더 강조된 색상
            { token: 'keyword', foreground: '569CD6', fontStyle: 'bold' },
            { token: 'keyword.control', foreground: 'C586C0', fontStyle: 'bold' },
            { token: 'keyword.builtin', foreground: '4EC9B0', fontStyle: 'bold' },
            
            // 변수 - 다양한 색상
            { token: 'variable', foreground: '9CDCFE' },
            { token: 'variable.predefined', foreground: '4FC1FF', fontStyle: 'bold' },
            
            // 함수 및 명령어
            { token: 'function', foreground: 'DCDCAA', fontStyle: 'bold' },
            { token: 'function.builtin', foreground: '79B8FF', fontStyle: 'bold' },
            
            // 연산자 및 구분자
            { token: 'operator', foreground: 'D4D4D4' },
            { token: 'delimiter', foreground: 'D4D4D4' },
            
            // 기타
            { token: 'constant', foreground: '4FC1FF' },
            { token: 'type', foreground: '4EC9B0' },
            { token: 'tag', foreground: '569CD6' },
            { token: 'attribute.name', foreground: '92C5F8' },
            { token: 'attribute.value', foreground: 'CE9178' }
          ],
          colors: {
            'editor.background': '#0d1117',
            'editor.foreground': '#f0f6fc',
            'editorLineNumber.foreground': '#7d8590',
            'editorLineNumber.activeForeground': '#f0f6fc',
            'editorCursor.foreground': '#58a6ff',
            'editor.selectionBackground': '#264f78',
            'editor.selectionHighlightBackground': '#264f7840',
            'editor.lineHighlightBackground': '#21262d',
            'editor.lineHighlightBorder': '#30363d',
            'editorIndentGuide.background': '#21262d',
            'editorIndentGuide.activeBackground': '#30363d',
            'editorBracketMatch.background': '#3fb95040',
            'editorBracketMatch.border': '#3fb950',
            'scrollbar.shadow': '#000000',
            'scrollbarSlider.background': '#484f5833',
            'scrollbarSlider.hoverBackground': '#484f5844',
            'scrollbarSlider.activeBackground': '#484f5888',
            'editorGutter.background': '#0d1117',
            'editorGutter.modifiedBackground': '#f2cc60',
            'editorGutter.addedBackground': '#3fb950',
            'editorGutter.deletedBackground': '#f85149',
            'editorError.foreground': '#f85149',
            'editorWarning.foreground': '#f2cc60',
            'editorInfo.foreground': '#58a6ff'
          }
        });

        // Bash 언어 토크나이저 등록
        monaco.languages.register({ id: 'bash' });
        
        // Bash 토크나이저 정의
        monaco.languages.setMonarchTokensProvider('bash', {
          tokenizer: {
            root: [
              // Shebang
              [/^#!/, 'comment', '@shebang'],
              
              // 주석
              [/#.*$/, 'comment'],
              
              // 문자열
              [/"([^"\\]|\\.)*$/, 'string.invalid'],
              [/"/, 'string', '@string'],
              [/'([^'\\]|\\.)*$/, 'string.invalid'],
              [/'/, 'string', '@stringSimple'],
              
              // 백틱 (명령 치환)
              [/`/, 'string.backtick', '@backtick'],
              
              // 명령 치환 $()
              [/\$\(/, 'variable', '@commandSubstitution'],
              
              // 변수
              [/\$\{[^}]*\}/, 'variable'],
              [/\$[a-zA-Z_][a-zA-Z0-9_]*/, 'variable'],
              [/\$[0-9]+/, 'variable.predefined'],
              [/\$[@*#?$!0-9]/, 'variable.predefined'],
              
              // 키워드 - 더 포괄적
              [/\b(if|then|else|elif|fi|for|do|done|while|until|case|esac|function|in|select)\b/, 'keyword'],
              [/\b(break|continue|return|exit|source|\.)\b/, 'keyword.control'],
              [/\b(echo|printf|read|test|export|local|declare|readonly|unset|shift|eval|exec|trap|wait|jobs|bg|fg|kill|nohup|time|timeout)\b/, 'keyword.builtin'],
              
              // 특수 패턴들
              [/\b(true|false)\b/, 'constant'],
              [/\b(Pass|Fail|PASS|FAIL)\b/, 'constant'],
              [/\b(LOG_FILE|ACCOUNTS|ALLOWED_SHELLS)\b/, 'variable'],
              
              // 연산자
              [/&&|\|\||>>|<<|[<>]=?|[!=]=|[&|;(){}[\]]/, 'operator'],
              [/[=+\-*/%]/, 'operator'],
              
              // 숫자
              [/\b\d+\b/, 'number'],
              
              // 파일 경로
              [/\/[^\s"'`]*/, 'string.filepath'],
              
              // 명령어 - 보안 스크립트 특화
              [/\b(getent|grep|awk|sed|tee|echo|cat|chmod|chown|find|passwd|useradd|userdel|usermod|systemctl|service)\b/, 'function.builtin'],
              [/\b(ls|cd|pwd|mkdir|rmdir|rm|cp|mv|sort|uniq|wc|head|tail|less|more|vi|nano|chgrp|ps|top|htop|kill|killall|which|whereis|locate|du|df|mount|umount|tar|gzip|gunzip|zip|unzip|curl|wget|ssh|scp|rsync|ping|netstat|ifconfig|iptables|crontab|sudo|su|whoami|id|groups|groupadd|groupdel)\b/, 'function'],
              
              // 명령어 시작 부분 (줄 시작)
              [/^[\s]*[a-zA-Z_][a-zA-Z0-9_]*(?=\s)/, 'function'],
              
              // 괄호 매칭
              [/[()]/, '@brackets'],
              [/[{}]/, '@brackets'],
              [/[\[\]]/, '@brackets']
            ],
            
            string: [
              [/[^\\"]+/, 'string'],
              [/\\./, 'string.escape'],
              [/"/, 'string', '@pop']
            ],
            
            stringSimple: [
              [/[^\\']+/, 'string'],
              [/\\./, 'string.escape'],
              [/'/, 'string', '@pop']
            ],
            
            backtick: [
              [/[^\\`]+/, 'string.backtick'],
              [/\\./, 'string.escape'],
              [/`/, 'string.backtick', '@pop']
            ],
            
            shebang: [
              [/.*$/, 'comment', '@pop']
            ],
            
            commandSubstitution: [
              [/[^)]+/, 'string.backtick'],
              [/\)/, 'variable', '@pop']
            ]
          }
        });

        // 고급 Bash 언어 설정
        monaco.languages.setLanguageConfiguration('bash', {
          brackets: [
            ['(', ')'],
            ['[', ']'],
            ['{', '}'],
            ['$(', ')'],
            ['${', '}']
          ],
          autoClosingPairs: [
            { open: '(', close: ')' },
            { open: '[', close: ']' },
            { open: '{', close: '}' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
            { open: '`', close: '`' },
            { open: '$(', close: ')' },
            { open: '${', close: '}' }
          ],
          surroundingPairs: [
            { open: '(', close: ')' },
            { open: '[', close: ']' },
            { open: '{', close: '}' },
            { open: '"', close: '"' },
            { open: "'", close: "'" },
            { open: '`', close: '`' }
          ],
          indentationRules: {
            increaseIndentPattern: /^(.*\s+)?(if|then|else|elif|fi|for|do|done|while|until|case|esac|function|\{)(\s+.*)?$/,
            decreaseIndentPattern: /^(.*\s+)?(fi|done|esac|\})(\s+.*)?$/
          }
        });

        // Bash 자동완성 제공
        monaco.languages.registerCompletionItemProvider('bash', {
          provideCompletionItems: (model, position) => {
            const suggestions = [
              // Bash 키워드
              {
                label: 'if',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'if [[ $1 ]]; then\n\t$0\nfi',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'if statement'
              },
              {
                label: 'for',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'for ${1:item} in ${2:items}; do\n\t$0\ndone',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'for loop'
              },
              {
                label: 'while',
                kind: monaco.languages.CompletionItemKind.Keyword,
                insertText: 'while [[ $1 ]]; do\n\t$0\ndone',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'while loop'
              },
              {
                label: 'function',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: 'function ${1:name}() {\n\t$0\n}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'function declaration'
              },
              // 보안 스크립트 관련 함수들
              {
                label: 'getent',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: 'getent passwd ${1:username}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Get entries from administrative database'
              },
              {
                label: 'grep',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: 'grep -${1:options} "${2:pattern}" ${3:file}',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Search text patterns'
              },
              {
                label: 'awk',
                kind: monaco.languages.CompletionItemKind.Function,
                insertText: 'awk -F: \'${1:{print $$1}}\'',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Text processing tool'
              },
              {
                label: 'echo_log',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: 'echo "${1:message}" | tee -a "$LOG_FILE"',
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'Echo message to console and log file'
              }
            ];
            return { suggestions };
          }
        });

        // 에디터 생성 (전문가 수준 설정)
        const editor = monaco.editor.create(containerRef.current, {
          value: content,
          language: language,
          theme: theme === 'dark' ? 'security-script-dark' : 'vs',
          readOnly: readOnly,
          automaticLayout: true,
          
          // 폰트 및 렌더링 설정
          fontSize: 15,
          fontFamily: 'JetBrains Mono, Fira Code, Consolas, "Courier New", monospace',
          fontLigatures: true,
          fontWeight: '400',
          letterSpacing: 0.5,
          lineHeight: 22,
          
          // 라인 번호 및 가이드
          lineNumbers: 'on',
          lineNumbersMinChars: 4,
          renderLineHighlight: 'line',
          renderLineHighlightOnlyWhenFocus: false,
          
          // 들여쓰기 및 공백
          renderWhitespace: 'boundary',
          renderIndentGuides: true,
          tabSize: 2,
          insertSpaces: true,
          detectIndentation: true,
          
          // 스크롤 및 뷰포트
          scrollBeyondLastLine: false,
          scrollBeyondLastColumn: 5,
          smoothScrolling: true,
          mouseWheelScrollSensitivity: 1,
          fastScrollSensitivity: 5,
          
          // 스크롤바 설정 (미니맵만 사용)
          scrollbar: {
            vertical: 'hidden',
            horizontal: 'hidden',
            verticalScrollbarSize: 0,
            horizontalScrollbarSize: 0,
            useShadows: false,
            handleMouseWheel: true,
            alwaysConsumeMouseWheel: false
          },
          
          // 미니맵 (고급 상호작용 기능)
          minimap: { 
            enabled: minimapEnabled,
            side: 'right',
            size: 'fill',
            showSlider: 'always',
            renderCharacters: true,
            maxColumn: 120,
            scale: 2,
            autohide: false,
            // 스크롤 및 상호작용 기능
            sectionHeaderFontSize: 9,
            sectionHeaderLetterSpacing: 1
          },
          
          // 고급 편집 기능
          wordWrap: 'on',
          wordWrapColumn: 120,
          wrappingIndent: 'indent',
          mouseWheelZoom: true,
          multiCursorModifier: 'ctrlCmd',
          selectionHighlight: true,
          occurrencesHighlight: true,
          
          // 코드 폴딩
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'mouseover',
          
          // 브래킷 매칭
          matchBrackets: 'always',
          renderControlCharacters: false,
          
          // 자동완성 및 제안
          quickSuggestions: {
            other: true,
            comments: false,
            strings: false
          },
          parameterHints: {
            enabled: true
          },
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: 'on',
          acceptSuggestionOnCommitCharacter: true,
          
          // 검색 및 찾기
          find: {
            seedSearchStringFromSelection: 'always',
            autoFindInSelection: 'never'
          },
          
          // 성능 최적화 (Overview Ruler 비활성화)
          overviewRulerLanes: 0,
          overviewRulerBorder: false,
          hideCursorInOverviewRuler: true,
          renderValidationDecorations: 'off',
          
          // 추가 기능
          dragAndDrop: true,
          links: true,
          contextmenu: true,
          copyWithSyntaxHighlighting: true,
          cursorBlinking: 'blink',
          cursorSmoothCaretAnimation: true,
          cursorStyle: 'line',
          cursorWidth: 2
        });

        editorRef.current = editor;
        setIsMonacoLoaded(true);
        
        // 에디터 레이아웃 초기화 및 스크롤바 숨기기
        setTimeout(() => {
          editor.layout();
          
          // 모든 스크롤바 숨기기 (미니맵만 사용)
          const scrollbars = containerRef.current?.querySelectorAll('.scrollbar');
          scrollbars?.forEach(scrollbar => {
            (scrollbar as HTMLElement).style.display = 'none';
          });
          
          // Overview Ruler 숨기기
          const overviewRuler = containerRef.current?.querySelector('.decorationsOverviewRuler');
          if (overviewRuler) {
            (overviewRuler as HTMLElement).style.display = 'none';
          }
          
          // 스크롤 기능은 유지하되 스크롤바만 숨김
          const scrollableElement = containerRef.current?.querySelector('.monaco-scrollable-element');
          if (scrollableElement) {
            (scrollableElement as HTMLElement).style.overflow = 'hidden';
          }
        }, 50);

        // 미니맵 강제 활성화 및 스크롤 기능 추가
        setTimeout(() => {
          const minimapElement = containerRef.current?.querySelector('.minimap');
          if (minimapElement) {
            (minimapElement as HTMLElement).style.display = 'block';
            (minimapElement as HTMLElement).style.visibility = 'visible';
            
            // 미니맵에 휠 스크롤 이벤트 추가
            minimapElement.addEventListener('wheel', (e: any) => {
              e.preventDefault();
              const deltaY = e.deltaY;
              const currentScrollTop = editor.getScrollTop();
              const newScrollTop = currentScrollTop + deltaY * 3; // 스크롤 속도 조절
              editor.setScrollTop(newScrollTop);
            });

            // 미니맵 클릭 앤 드래그 기능 강화
            let isDragging = false;

            minimapElement.addEventListener('mousedown', (e: any) => {
              isDragging = true;
              const rect = minimapElement.getBoundingClientRect();
              const y = e.clientY - rect.top;
              const ratio = y / rect.height;
              const maxScrollTop = editor.getScrollHeight() - editor.getLayoutInfo().height;
              const newScrollTop = ratio * maxScrollTop;
              editor.setScrollTop(newScrollTop);
            });

            document.addEventListener('mousemove', (e: any) => {
              if (isDragging) {
                const rect = minimapElement.getBoundingClientRect();
                const y = e.clientY - rect.top;
                const ratio = Math.max(0, Math.min(1, y / rect.height));
                const maxScrollTop = editor.getScrollHeight() - editor.getLayoutInfo().height;
                const newScrollTop = ratio * maxScrollTop;
                editor.setScrollTop(newScrollTop);
              }
            });

            document.addEventListener('mouseup', () => {
              isDragging = false;
            });
          }
          
          // 에디터 레이아웃 새로고침
          editor.layout();
        }, 100);

        console.log('Monaco Editor 초기화 완료');

        // 내용 변경 감지
        const disposable = editor.onDidChangeModelContent(() => {
          const newContent = editor.getValue();
          setContent(newContent);
          if (onChange) {
            onChange(newContent);
          }
        });

        // 고급 키보드 단축키 설정
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
          if (onSave) {
            onSave(editor.getValue());
          }
        });

        // 추가 단축키들
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
          editor.trigger('', 'editor.action.duplicateSelection', {});
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyK, () => {
          editor.trigger('', 'editor.action.deleteLines', {});
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
          editor.trigger('', 'editor.action.commentLine', {});
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, () => {
          editor.trigger('', 'actions.find', {});
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF, () => {
          editor.trigger('', 'editor.action.startFindReplaceAction', {});
        });

        // 미니맵 토글 단축키
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyM, () => {
          const currentOptions = editor.getOptions();
          const minimapEnabled = currentOptions.get(monaco.editor.EditorOption.minimap).enabled;
          editor.updateOptions({
            minimap: {
              enabled: !minimapEnabled,
              side: 'right',
              size: 'fill',
              showSlider: 'always',
              renderCharacters: true,
              maxColumn: 120,
              scale: 2,
              autohide: false
            }
          });
        });

        // 빠른 네비게이션 단축키
        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Home, () => {
          editor.setScrollTop(0);
          editor.setPosition({ lineNumber: 1, column: 1 });
        });

        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.End, () => {
          const model = editor.getModel();
          if (model) {
            const lastLine = model.getLineCount();
            editor.setScrollTop(editor.getScrollHeight());
            editor.setPosition({ lineNumber: lastLine, column: model.getLineMaxColumn(lastLine) });
          }
        });

        // 고급 편집 액션들
        editor.addAction({
          id: 'format-document',
          label: 'Format Document',
          keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyI],
          contextMenuGroupId: 'modification',
          contextMenuOrder: 1.5,
          run: () => {
            editor.trigger('', 'editor.action.formatDocument', {});
          }
        });

        editor.addAction({
          id: 'run-script',
          label: 'Run Script',
          keybindings: [monaco.KeyCode.F5],
          contextMenuGroupId: 'navigation',
          contextMenuOrder: 1.5,
          run: () => {
            console.log('스크립트 실행:', editor.getValue());
            // 실행 로직을 여기에 추가
          }
        });

        // Bash 문법 검증
        const bashDiagnostics = () => {
          const model = editor.getModel();
          if (!model) return;

          const content = model.getValue();
          const lines = content.split('\n');
          const markers: any[] = [];

          lines.forEach((line, index) => {
            // 기본적인 Bash 문법 검사
            if (line.trim().startsWith('if') && !line.includes('then') && !line.endsWith(';')) {
              markers.push({
                severity: monaco.MarkerSeverity.Warning,
                startLineNumber: index + 1,
                startColumn: 1,
                endLineNumber: index + 1,
                endColumn: line.length + 1,
                message: 'if문에는 "then"이 필요합니다.'
              });
            }

            // 닫히지 않은 따옴표 검사
            const quotes = line.match(/['"]/g);
            if (quotes && quotes.length % 2 !== 0) {
              markers.push({
                severity: monaco.MarkerSeverity.Error,
                startLineNumber: index + 1,
                startColumn: 1,
                endLineNumber: index + 1,
                endColumn: line.length + 1,
                message: '닫히지 않은 따옴표가 있습니다.'
              });
            }

            // 보안 스크립트 모범 사례 검사
            if (line.includes('rm -rf') && !line.includes('#')) {
              markers.push({
                severity: monaco.MarkerSeverity.Warning,
                startLineNumber: index + 1,
                startColumn: line.indexOf('rm -rf') + 1,
                endLineNumber: index + 1,
                endColumn: line.indexOf('rm -rf') + 7,
                message: '위험한 명령어입니다. 주의해서 사용하세요.'
              });
            }
          });

          monaco.editor.setModelMarkers(model, 'bash', markers);
        };

        // 실시간 문법 검사
        const syntaxCheckDisposable = editor.onDidChangeModelContent(() => {
          setTimeout(bashDiagnostics, 500); // 500ms 딜레이 후 검사
        });

        // 초기 문법 검사
        bashDiagnostics();

        // 정리 함수 반환
        return () => {
          disposable.dispose();
          syntaxCheckDisposable.dispose();
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

  // 미니맵 상태 업데이트
  useEffect(() => {
    if (editorRef.current && isMonacoLoaded) {
      editorRef.current.updateOptions({
        minimap: {
          enabled: minimapEnabled,
          side: 'right',
          size: 'fill',
          showSlider: 'always',
          renderCharacters: true,
          maxColumn: 120,
          scale: 2,
          autohide: false
        }
      });
    }
  }, [minimapEnabled, isMonacoLoaded]);

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
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Monaco Editor 컨테이너 */}
      <div
        ref={containerRef}
        style={{ 
          height: '100%', 
          width: '100%',
          display: isMonacoLoaded ? 'block' : 'none',
          overflow: 'hidden'
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