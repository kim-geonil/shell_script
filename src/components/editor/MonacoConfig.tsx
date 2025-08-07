import * as monaco from 'monaco-editor';

// Bash language configuration
const bashLanguageConfig = {
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
    ['`', '`'],
    ['"', '"'],
    ["'", "'"]
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '`', close: '`' },
    { open: '"', close: '"', notIn: ['string'] },
    { open: "'", close: "'", notIn: ['string', 'comment'] }
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '`', close: '`' },
    { open: '"', close: '"' },
    { open: "'", close: "'" }
  ],
  folding: {
    markers: {
      start: new RegExp('^\\s*#\\s*region\\b'),
      end: new RegExp('^\\s*#\\s*endregion\\b')
    }
  }
};

// Bash language tokens
const bashLanguageTokens = {
  defaultToken: '',
  tokenPostfix: '.bash',
  keywords: [
    'if', 'then', 'else', 'elif', 'fi', 'case', 'esac', 'for', 'select',
    'while', 'until', 'do', 'done', 'in', 'function', 'time', 'coproc',
    'local', 'readonly', 'export', 'unset', 'declare', 'typeset',
    'alias', 'unalias', 'set', 'unset', 'shift', 'source', '.',
    'break', 'continue', 'return', 'exit', 'exec', 'eval', 'trap',
    'true', 'false', 'test', 'echo', 'printf', 'read', 'cd', 'pwd',
    'pushd', 'popd', 'dirs', 'let', 'expr', 'bc', 'awk', 'sed',
    'grep', 'sort', 'uniq', 'cut', 'tr', 'wc', 'head', 'tail',
    'cat', 'less', 'more', 'find', 'xargs', 'chmod', 'chown', 'chgrp',
    'ls', 'cp', 'mv', 'rm', 'mkdir', 'rmdir', 'touch', 'ln'
  ],
  builtins: [
    'alias', 'bind', 'builtin', 'caller', 'command', 'declare', 'echo',
    'enable', 'help', 'let', 'local', 'logout', 'mapfile', 'printf',
    'read', 'readarray', 'source', 'type', 'typeset', 'ulimit', 'unalias'
  ],
  operators: [
    '=', '==', '!=', '!', '&&', '||', '&', '|', ';', ';;', ';&', ';;&',
    '()', '{}', '[]', '<', '>', '<<', '>>', '<<<', '<&', '>&', '<>', '&>',
    '>|', '!', '-eq', '-ne', '-lt', '-le', '-gt', '-ge', '-z', '-n',
    '-e', '-f', '-d', '-r', '-w', '-x', '-s', '-u', '-g', '-k', '-O', '-G',
    '-N', '-nt', '-ot', '-ef', '=~', '+', '-', '*', '/', '%', '**',
    '++', '--', '+=', '-=', '*=', '/=', '%=', '<<', '>>', '&', '|', '^', '~'
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  
  tokenizer: {
    root: [
      // Shebang
      [/^#!.*$/, 'metatag'],
      
      // Comments
      [/#.*$/, 'comment'],
      
      // Keywords
      [/\b(?:if|then|else|elif|fi|case|esac|for|while|until|do|done|function|select|in|time|coproc)\b/, 'keyword'],
      
      // Builtins
      [/\b(?:alias|bind|builtin|caller|command|declare|echo|enable|help|let|local|logout|printf|read|source|type|ulimit)\b/, 'keyword.builtin'],
      
      // Variables
      [/\$\{[^}]+\}/, 'variable'],
      [/\$[a-zA-Z_][a-zA-Z0-9_]*/, 'variable'],
      [/\$[0-9]+/, 'variable.special'],
      [/\$[#@*?$!]/, 'variable.special'],
      
      // Strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string_double'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/'/, 'string', '@string_single'],
      [/`/, 'string', '@string_backtick'],
      
      // Numbers
      [/\b0[xX][0-9a-fA-F]+\b/, 'number.hex'],
      [/\b0[0-7]+\b/, 'number.octal'],
      [/\b\d+\b/, 'number'],
      
      // Operators
      [/[=!<>]=|[<>]/, 'operator.comparison'],
      [/&&|\|\|/, 'operator.logical'],
      [/[+\-*/%]/, 'operator.arithmetic'],
      [/[&|^~]/, 'operator.bitwise'],
      [/[;,.]/, 'delimiter'],
      
      // Brackets
      [/[{}()\[\]]/, '@brackets'],
      
      // File descriptors and redirections
      [/[0-9]*[<>&]\|?|>>?/, 'operator.redirect'],
      
      // Command substitution
      [/\$\(/, 'punctuation.definition.string.begin', '@command_substitution'],
      
      // Process substitution
      [/<\(/, 'punctuation.definition.string.begin', '@process_substitution'],
      [/>\(/, 'punctuation.definition.string.begin', '@process_substitution'],
    ],
    
    string_double: [
      [/[^\\"$]+/, 'string'],
      [/\$\{[^}]+\}/, 'variable'],
      [/\$[a-zA-Z_][a-zA-Z0-9_]*/, 'variable'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop']
    ],
    
    string_single: [
      [/[^']+/, 'string'],
      [/'/, 'string', '@pop']
    ],
    
    string_backtick: [
      [/[^`]+/, 'string'],
      [/`/, 'string', '@pop']
    ],
    
    command_substitution: [
      [/[^)]+/, 'string'],
      [/\)/, 'punctuation.definition.string.end', '@pop']
    ],
    
    process_substitution: [
      [/[^)]+/, 'string'],
      [/\)/, 'punctuation.definition.string.end', '@pop']
    ]
  }
};

// Custom completion provider for bash
function createBashCompletionProvider() {
  return monaco.languages.registerCompletionItemProvider('bash', {
    provideCompletionItems: (model, position) => {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: 1,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions = [
        // Basic commands
        {
          label: 'if',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'if [ ${1:condition} ]; then\n\t${2:# code}\nfi',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'if statement',
          range
        },
        {
          label: 'for',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'for ${1:item} in ${2:list}; do\n\t${3:# code}\ndone',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'for loop',
          range
        },
        {
          label: 'while',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: 'while [ ${1:condition} ]; do\n\t${2:# code}\ndone',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'while loop',
          range
        },
        {
          label: 'function',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'function ${1:name}() {\n\t${2:# code}\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'function definition',
          range
        },
        // Security check templates
        {
          label: 'check_file_permissions',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'check_file_permissions() {',
            '\tlocal file="$1"',
            '\tlocal expected_perms="$2"',
            '\t',
            '\tif [ ! -f "$file" ]; then',
            '\t\techo "FAIL: File $file does not exist"',
            '\t\treturn 1',
            '\tfi',
            '\t',
            '\tactual_perms=$(stat -c "%a" "$file")',
            '\tif [ "$actual_perms" != "$expected_perms" ]; then',
            '\t\techo "FAIL: $file has permissions $actual_perms, expected $expected_perms"',
            '\t\treturn 1',
            '\telse',
            '\t\techo "PASS: $file has correct permissions $expected_perms"',
            '\t\treturn 0',
            '\tfi',
            '}'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Check file permissions security template',
          range
        },
        {
          label: 'check_user_account',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'check_user_account() {',
            '\tlocal username="$1"',
            '\t',
            '\tif ! id "$username" &>/dev/null; then',
            '\t\techo "FAIL: User $username does not exist"',
            '\t\treturn 1',
            '\tfi',
            '\t',
            '\t# Check if user account is locked',
            '\tif passwd -S "$username" | grep -q " L "; then',
            '\t\techo "WARNING: User $username account is locked"',
            '\telse',
            '\t\techo "PASS: User $username account is active"',
            '\tfi',
            '\t',
            '\treturn 0',
            '}'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Check user account security template',
          range
        },
        {
          label: 'log_result',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: [
            'log_result() {',
            '\tlocal status="$1"',
            '\tlocal message="$2"',
            '\tlocal timestamp=$(date "+%Y-%m-%d %H:%M:%S")',
            '\t',
            '\techo "[$timestamp] [$status] $message" | tee -a "$LOG_FILE"',
            '}'
          ].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Log result template',
          range
        }
      ];

      return { suggestions };
    }
  });
}

// Custom theme for NcuScript
const ncuScriptTheme = {
  base: 'vs-dark' as const,
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    { token: 'keyword', foreground: '569CD6' },
    { token: 'keyword.builtin', foreground: 'DCDCAA' },
    { token: 'string', foreground: 'CE9178' },
    { token: 'string.escape', foreground: 'D7BA7D' },
    { token: 'variable', foreground: '9CDCFE' },
    { token: 'variable.special', foreground: 'FFC66D' },
    { token: 'number', foreground: 'B5CEA8' },
    { token: 'number.hex', foreground: 'B5CEA8' },
    { token: 'number.octal', foreground: 'B5CEA8' },
    { token: 'operator', foreground: 'C586C0' },
    { token: 'operator.comparison', foreground: 'C586C0' },
    { token: 'operator.logical', foreground: 'C586C0' },
    { token: 'operator.arithmetic', foreground: 'C586C0' },
    { token: 'operator.redirect', foreground: 'FF6B6B' },
    { token: 'metatag', foreground: '808080' },
    { token: 'delimiter', foreground: 'CCCCCC' },
  ],
  colors: {
    'editor.background': '#1A1A1A',
    'editor.foreground': '#CCCCCC',
    'editorLineNumber.foreground': '#858585',
    'editorLineNumber.activeForeground': '#CCCCCC',
    'editor.selectionBackground': '#264F78',
    'editor.selectionHighlightBackground': '#ADD6FF26',
    'editorCursor.foreground': '#AEAFAD',
    'editor.findMatchBackground': '#515C6A',
    'editor.findMatchHighlightBackground': '#EA5C0055',
    'editor.linkedEditingBackground': '#FF00FF',
    'editorBracketMatch.background': '#0064001A',
    'editorBracketMatch.border': '#888888',
  }
};

export function initializeMonacoEditor() {
  // Register bash language if not already registered
  const languages = monaco.languages.getLanguages();
  const bashExists = languages.some(lang => lang.id === 'bash');
  
  if (!bashExists) {
    monaco.languages.register({ id: 'bash' });
    monaco.languages.setLanguageConfiguration('bash', bashLanguageConfig);
    monaco.languages.setMonarchTokensProvider('bash', bashLanguageTokens);
  }

  // Register completion provider
  createBashCompletionProvider();

  // Define custom theme
  monaco.editor.defineTheme('ncuscript-dark', ncuScriptTheme);

  // Set up global editor settings
  monaco.editor.setTheme('ncuscript-dark');

  // Configure global settings for performance optimization
  monaco.editor.setModelLanguage.defaults?.setDiagnosticsOptions?.({
    noSemanticValidation: true,
    noSyntaxValidation: false
  });
  monaco.editor.defineTheme('ncuscript-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '008000', fontStyle: 'italic' },
      { token: 'keyword', foreground: '0000FF' },
      { token: 'keyword.builtin', foreground: '795E26' },
      { token: 'string', foreground: 'A31515' },
      { token: 'variable', foreground: '001080' },
      { token: 'variable.special', foreground: 'AF00DB' },
      { token: 'number', foreground: '098658' },
      { token: 'operator', foreground: '0431FA' },
      { token: 'operator.redirect', foreground: 'E31C3D' },
      { token: 'metatag', foreground: '808080' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#000000',
    }
  });

  console.log('Monaco Editor initialized with bash language support');
}

export { bashLanguageConfig, bashLanguageTokens, ncuScriptTheme };