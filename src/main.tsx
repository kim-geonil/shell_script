import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import '../styles/globals.css'

console.log('🚀 Application starting...');
console.log('📍 Entry point: /src/main.tsx');
console.log('🌍 Environment:', import.meta.env.MODE);

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found. Make sure there is a div with id="root" in your HTML.');
}

console.log('🎯 Rendering App...');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

console.log('✅ App rendered successfully');