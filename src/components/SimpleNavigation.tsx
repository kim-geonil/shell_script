import React, { useState } from 'react';

interface SimpleNavigationProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function SimpleNavigation({ onNavigate, currentPage }: SimpleNavigationProps) {
  const pages = [
    { id: 'dashboard', label: '대시보드', icon: '📊' },
    { id: 'scripts', label: '스크립트', icon: '📝' },
    { id: 'templates', label: '템플릿', icon: '📋' },
    { id: 'tests', label: '테스트', icon: '🧪' },
  ];

  return (
    <nav style={{ 
      backgroundColor: '#333',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '20px'
    }}>
      <h2 style={{ 
        color: '#4CAF50', 
        marginTop: 0, 
        marginBottom: '15px' 
      }}>
        📚 NcuScript Automator
      </h2>
      
      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        flexWrap: 'wrap' 
      }}>
        {pages.map(page => (
          <button
            key={page.id}
            onClick={() => onNavigate(page.id)}
            style={{
              backgroundColor: currentPage === page.id ? '#4CAF50' : '#555',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background-color 0.2s'
            }}
          >
            <span>{page.icon}</span>
            <span>{page.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}