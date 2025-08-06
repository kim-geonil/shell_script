import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function Login() {
  const location = useLocation();
  
  // For debugging, let's just redirect to dashboard
  return <Navigate to="/dashboard" replace />;

  // Simple login form without complex dependencies
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '40px',
        borderRadius: '12px',
        border: '1px solid #444',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          backgroundColor: '#3b82f6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          N
        </div>
        
        <h1 style={{ marginBottom: '10px', fontSize: '24px' }}>NcuScript Automator</h1>
        <p style={{ marginBottom: '30px', color: '#888' }}>
          보안 스크립트 관리를 위해 로그인하세요
        </p>
        
        <button
          onClick={() => window.location.href = '/dashboard'}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
        >
          데모 로그인
        </button>
        
        <p style={{ fontSize: '14px', color: '#888' }}>
          데모 버전: 바로 로그인하여 앱을 체험해보세요
        </p>
      </div>
    </div>
  );
}