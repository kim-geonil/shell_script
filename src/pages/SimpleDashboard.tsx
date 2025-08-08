import { useState } from 'react';
import ScriptEditor from './ScriptEditor';
import { Shield, TrendingUp, CheckCircle, AlertTriangle, Clock, Zap, ArrowLeft } from 'lucide-react';

export default function SimpleDashboard() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor'>('dashboard');
  const [selectedScriptId, setSelectedScriptId] = useState<string | null>(null);

  const stats = [
    { 
      label: '총 스크립트', 
      value: '12', 
      icon: '📝', 
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      change: '+3',
      changeType: 'increase'
    },
    { 
      label: '완료된 스크립트', 
      value: '5', 
      icon: '✅', 
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      change: '+1',
      changeType: 'increase'
    },
    { 
      label: '진행 중인 스크립트', 
      value: '8', 
      icon: '⏳', 
      color: 'text-amber-400',
      bgColor: 'bg-amber-400/10',
      change: '+2',
      changeType: 'increase'
    }
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
        window.history.pushState({}, '', '/scripts/new');
        window.dispatchEvent(new Event('popstate'));
      },
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: '템플릿 라이브러리',
      icon: '📚',
      description: '기존 템플릿 탐색 및 사용',
      onClick: () => {
        window.history.pushState(null, '', '/templates');
        window.dispatchEvent(new PopStateEvent('popstate'));
      },
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

  // 대시보드 메인 뷰
  return (
    <div className="min-h-screen bg-background space-y-8 pb-8 relative">
      {/* 배경 패턴 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 pointer-events-none"></div>
      <div className="relative z-10">
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
              <h1 className="text-2xl font-bold text-glow bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
                NcuScript Automator
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                보안 준수 검사를 위한 Bash 스크립트 생성 및 관리 플랫폼
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 통계 개요 섹션 */}
      <div className="space-y-6">
        <div className="border-b-2 border-primary/30 pb-6 mb-6 bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-lg">
          <h2 className="text-xl font-bold text-primary flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-full">📊</div>
            통계 개요
          </h2>
          <p className="text-sm text-muted-foreground ml-14">시스템 전반의 주요 지표를 확인하세요</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stats-card p-6 group cursor-pointer border-l-4 shadow-lg hover:shadow-xl border border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 animate-fade-in-up"
              style={{
                animationDelay: `${index * 150}ms`,
                animationFillMode: 'backwards',
                borderLeftColor: stat.color === 'text-blue-400' ? '#60a5fa' : 
                                stat.color === 'text-green-400' ? '#4ade80' :
                                stat.color === 'text-amber-400' ? '#fbbf24' : '#f87171'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="text-3xl p-2 rounded-full bg-muted/30 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: stat.bgColor }}
                >
                  {stat.icon}
                </div>
                <div 
                  className={`text-sm px-3 py-1.5 rounded-full flex items-center gap-1 font-medium border animate-bounce-in ${
                    stat.changeType === 'increase' 
                      ? 'text-green-600 bg-green-50 border-green-200' 
                      : 'text-red-600 bg-red-50 border-red-200'
                  }`}
                  style={{ animationDelay: `${(index * 150) + 300}ms` }}
                >
                  <TrendingUp className={`h-3 w-3 transition-transform duration-300 ${stat.changeType === 'decrease' ? 'rotate-180' : ''}`} />
                  {stat.change}
                </div>
              </div>
              <div className="space-y-2">
                <div className={`text-3xl font-bold text-glow ${stat.color} animate-count-up`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full border-t-2 border-primary/20 my-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
      </div>

      {/* 빠른 작업 섹션 */}
      <div className="space-y-6">
        <div className="border-b-2 border-primary/30 pb-6 mb-6 bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-lg">
          <h2 className="text-xl font-bold text-primary flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/20 rounded-full">⚡</div>
            빠른 작업
          </h2>
          <p className="text-sm text-muted-foreground ml-14">자주 사용하는 기능에 빠르게 접근하세요</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="group relative overflow-hidden cyber-card p-6 text-left transition-all duration-300 hover:scale-105 border-2 border-border/30 hover:border-primary/50 shadow-lg hover:shadow-xl bg-card/90 backdrop-blur-sm"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 p-3 rounded-lg bg-muted/20">
                  {action.icon}
                </div>
                <h3 className="text-base font-semibold text-primary mb-2 group-hover:text-cyan-400 transition-colors duration-300">
                  {action.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 구분선 */}
      <div className="w-full border-t-2 border-primary/20 my-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"></div>
      </div>

      {/* 최근 스크립트 섹션 */}
      <div className="space-y-6">
        <div className="border-b-2 border-primary/30 pb-6 mb-6 bg-gradient-to-r from-primary/5 to-transparent p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-primary flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/20 rounded-full">📝</div>
                최근 스크립트
              </h2>
              <p className="text-sm text-muted-foreground ml-14">최근에 작업한 스크립트를 확인하고 편집하세요</p>
            </div>
            <button 
              onClick={() => {
                window.history.pushState(null, '', '/templates');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="cyber-button px-4 py-2 text-sm font-medium flex items-center gap-2 hover:bg-primary/10 transition-colors"
            >
              모든 템플릿 보기
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </button>
          </div>
        </div>
        
        <div className="cyber-card overflow-hidden border-2 border-border/40 shadow-xl bg-card/95 backdrop-blur-sm">
          <div className="divide-y-2 divide-border/40">
            {recentScripts.map((script) => (
              <button
                key={script.id}
                onClick={() => handleScriptClick(script.id)}
                className="w-full p-6 text-left hover:bg-primary/10 transition-all duration-300 group border-l-4 border-l-primary/40 hover:border-l-primary shadow-sm hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-full bg-muted/30">
                          {getStatusIcon(script.status)}
                        </div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                          {script.name}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-primary/20 text-primary border border-primary/30">
                          {script.type}
                        </span>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusClass(script.status)}`}>
                          {getStatusText(script.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/20">
                        <Clock className="h-4 w-4" />
                        <span>마지막 실행: {script.lastRun}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/20">
                        <Zap className="h-4 w-4" />
                        <span>소요시간: {script.duration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-primary group-hover:translate-x-1 transition-transform duration-300 p-2 rounded-full bg-primary/10">
                    <ArrowLeft className="h-5 w-5 rotate-180" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}