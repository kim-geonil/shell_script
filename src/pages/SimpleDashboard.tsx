import React, { useState } from 'react';
import ScriptEditor from './ScriptEditor';
import TemplateLibrary from './TemplateLibrary';
import { Shield, TrendingUp, CheckCircle, AlertTriangle, Clock, Zap, ArrowLeft } from 'lucide-react';

export default function SimpleDashboard() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'templates'>('dashboard');
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);

  const stats = [
    { 
      label: '총 스크립트', 
      value: '12', 
      icon: '📝', 
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+3',
      changeType: 'increase'
    },
    { 
      label: '템플릿', 
      value: '5', 
      icon: '📋', 
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      change: '+1',
      changeType: 'increase'
    },
    { 
      label: '성공한 테스트', 
      value: '8', 
      icon: '✅', 
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      change: '+2',
      changeType: 'increase'
    },
    { 
      label: '실패한 테스트', 
      value: '2', 
      icon: '❌', 
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      change: '-1',
      changeType: 'decrease'
    },
  ];

  const recentScripts = [
    { 
      id: 'u102-security-check', 
      name: 'U-102 사용자 계정 보안 검사', 
      type: 'U-102', 
      status: 'success',
      lastRun: '2024-01-15 14:30',
      duration: '2분 15초'
    },
    { 
      id: 'u103-password-policy', 
      name: 'U-103 패스워드 정책 검사', 
      type: 'U-103', 
      status: 'draft',
      lastRun: '2024-01-15 13:45',
      duration: '-'
    },
    { 
      id: 'u106-session-management', 
      name: 'U-106 세션 관리 검사', 
      type: 'U-106', 
      status: 'testing',
      lastRun: '2024-01-15 11:20',
      duration: '5분 30초'
    },
  ];

  const quickActions = [
    {
      title: '새 스크립트',
      icon: '➕',
      description: '새로운 보안 스크립트 생성',
      onClick: () => {
        setSelectedScriptId(null);
        setCurrentView('editor');
      },
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: '템플릿 라이브러리',
      icon: '📚',
      description: '기존 템플릿 탐색 및 사용',
      onClick: () => setCurrentView('templates'),
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'U-102 템플릿',
      icon: '🔐',
      description: 'U-102 템플릿으로 시작',
      onClick: () => {
        setSelectedScriptId('u102-template');
        setCurrentView('editor');
      },
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'U-103 템플릿',
      icon: '🔑',
      description: 'U-103 템플릿으로 시작',
      onClick: () => {
        setSelectedScriptId('u103-template');
        setCurrentView('editor');
      },
      gradient: 'from-orange-500 to-red-500'
    },
  ];

  const handleScriptClick = (scriptId: string) => {
    setSelectedScriptId(scriptId);
    setCurrentView('editor');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedScriptId(null);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'draft': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'testing': return <Zap className="h-4 w-4 text-primary" />;
      default: return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return '완료';
      case 'draft': return '초안';
      case 'testing': return '테스트 중';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'success': return 'status-success';
      case 'draft': return 'status-warning';
      case 'testing': return 'status-running';
      default: return 'status-error';
    }
  };

  // 에디터 뷰
  if (currentView === 'editor') {
    return (
      <div className="min-h-screen bg-background">
        <div className="cyber-card p-4 mb-6 flex items-center gap-4">
          <button
            onClick={handleBackToDashboard}
            className="cyber-button px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            대시보드로 돌아가기
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 h-6 w-6 text-primary animate-pulse opacity-30">
                <Shield className="h-6 w-6" />
              </div>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              스크립트 에디터
            </h2>
          </div>
        </div>
        <ScriptEditor scriptId={selectedScriptId} />
      </div>
    );
  }

  // 템플릿 라이브러리 뷰
  if (currentView === 'templates') {
    return (
      <div className="min-h-screen bg-background">
        <div className="cyber-card p-4 mb-6 flex items-center gap-4">
          <button
            onClick={handleBackToDashboard}
            className="cyber-button px-4 py-2 text-sm font-medium transition-all duration-300 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            대시보드로 돌아가기
          </button>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 h-6 w-6 text-primary animate-pulse opacity-30">
                <Shield className="h-6 w-6" />
              </div>
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              템플릿 라이브러리
            </h2>
          </div>
        </div>
        <TemplateLibrary onSelectTemplate={(templateId) => {
          setSelectedScriptId(templateId);
          setCurrentView('editor');
        }} />
      </div>
    );
  }

  // 대시보드 메인 뷰
  return (
    <div className="min-h-screen bg-background space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden cyber-card p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-cyan-500/5"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <Shield className="h-12 w-12 text-primary" />
              <div className="absolute inset-0 h-12 w-12 text-primary animate-pulse opacity-30">
                <Shield className="h-12 w-12" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-glow bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                NcuScript Automator
              </h1>
              <p className="text-muted-foreground mt-1">
                보안 준수 검사를 위한 Bash 스크립트 생성 및 관리 플랫폼
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="stats-card p-6 group cursor-pointer">
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{stat.icon}</div>
              <div className={`text-sm px-2 py-1 rounded-full flex items-center gap-1 ${
                stat.changeType === 'increase' 
                  ? 'text-green-400 bg-green-400/10' 
                  : 'text-red-400 bg-red-400/10'
              }`}>
                <TrendingUp className={`h-3 w-3 ${stat.changeType === 'decrease' ? 'rotate-180' : ''}`} />
                {stat.change}
              </div>
            </div>
            <div className="space-y-2">
              <div className={`text-3xl font-bold text-glow ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-primary">빠른 작업</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="group relative overflow-hidden cyber-card p-6 text-left transition-all duration-300 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                  {action.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Scripts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-primary">최근 스크립트</h2>
          </div>
          <button 
            onClick={() => setCurrentView('templates')}
            className="cyber-button px-4 py-2 text-sm font-medium flex items-center gap-2"
          >
            모든 템플릿 보기
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </button>
        </div>
        
        <div className="cyber-card overflow-hidden">
          <div className="divide-y divide-border/50">
            {recentScripts.map((script, index) => (
              <button
                key={script.id}
                onClick={() => handleScriptClick(script.id)}
                className="w-full p-6 text-left hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(script.status)}
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {script.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
                          {script.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusClass(script.status)}`}>
                          {getStatusText(script.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>마지막 실행: {script.lastRun}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="h-4 w-4" />
                        <span>소요시간: {script.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-primary group-hover:translate-x-1 transition-transform duration-300">
                    <ArrowLeft className="h-5 w-5 rotate-180" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}