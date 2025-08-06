/*
 * ⚠️  DEPRECATED FILE - DO NOT USE
 * 
 * This file is causing conflicts with the main application.
 * The real application entry point is: /src/main.tsx -> /src/App.tsx
 * 
 * This file should be deleted to avoid import conflicts.
 */

export default function App() {
  console.error('❌ Wrong App.tsx file loaded! This should not happen.');
  console.log('💡 The correct entry point is /src/App.tsx');
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#0a0a0a',
      color: '#fff',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
        <h1 style={{ color: '#ff4444', marginBottom: '1rem' }}>잘못된 Entry Point</h1>
        <p style={{ color: '#888', marginBottom: '1rem' }}>
          루트 /App.tsx 파일이 로드되었습니다. 이 파일은 삭제되어야 합니다.
        </p>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '2rem' }}>
          올바른 Entry Point: /src/main.tsx → /src/App.tsx
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            background: '#00b4ff',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          새로고침
        </button>
      </div>
    </div>
  );
}