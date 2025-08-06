import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Zap, TrendingUp, Eye, RotateCcw, Filter } from 'lucide-react';

export default function ExecutionHistory() {
  const [filter, setFilter] = useState<'all' | 'success' | 'failed' | 'running'>('all');

  const executions = [
    {
      id: '1',
      scriptName: 'U-102 사용자 계정 보안 검사',
      status: 'success',
      startTime: '2024-01-15 14:30:00',
      endTime: '2024-01-15 14:32:15',
      duration: '2분 15초',
      exitCode: 0,
      testsPassed: 8,
      testsFailed: 0,
      warnings: 2,
      output: '모든 보안 검사를 성공적으로 완료했습니다.'
    },
    {
      id: '2',
      scriptName: 'U-103 패스워드 정책 검사',
      status: 'failed',
      startTime: '2024-01-15 13:45:00',
      endTime: '2024-01-15 13:46:30',
      duration: '1분 30초',
      exitCode: 1,
      testsPassed: 3,
      testsFailed: 2,
      warnings: 1,
      output: '패스워드 복잡성 정책이 올바르게 설정되지 않았습니다.'
    },
    {
      id: '3',
      scriptName: 'U-106 세션 관리 검사',
      status: 'running',
      startTime: '2024-01-15 15:10:00',
      endTime: null,
      duration: '실행 중...',
      exitCode: null,
      testsPassed: 0,
      testsFailed: 0,
      warnings: 0,
      output: '세션 타임아웃 설정을 검사하고 있습니다...'
    },
    {
      id: '4',
      scriptName: '서버 기본 보안 설정',
      status: 'success',
      startTime: '2024-01-15 11:20:00',
      endTime: '2024-01-15 11:25:45',
      duration: '5분 45초',
      exitCode: 0,
      testsPassed: 12,
      testsFailed: 0,
      warnings: 3,
      output: '서버 보안 설정이 양호합니다.'
    },
    {
      id: '5',
      scriptName: 'U-107 접근제어 검사',
      status: 'failed',
      startTime: '2024-01-14 16:15:00',
      endTime: '2024-01-14 16:16:20',
      duration: '1분 20초',
      exitCode: 2,
      testsPassed: 1,
      testsFailed: 4,
      warnings: 0,
      output: '접근제어 설정에서 여러 보안 문제가 발견되었습니다.'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-400" />;
      case 'running': return <Clock className="h-4 w-4 text-primary animate-spin" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'success': return '성공';
      case 'failed': return '실패';
      case 'running': return '실행 중';
      default: return '알 수 없음';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'success': return 'status-success';
      case 'failed': return 'status-error';
      case 'running': return 'status-running';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const filteredExecutions = executions.filter(execution => {
    if (filter === 'all') return true;
    return execution.status === filter;
  });

  const handleViewDetails = (executionId: string) => {
    console.log('실행 세부사항 보기:', executionId);
  };

  const handleRerun = (executionId: string) => {
    console.log('다시 실행:', executionId);
  };

  return (
    <div className="min-h-screen bg-background space-y-8">
      {/* Header */}
      <div className="cyber-card p-6 border-b border-border/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <Clock className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 h-8 w-8 text-primary animate-pulse opacity-30">
              <Clock className="h-8 w-8" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              실행 이력
            </h1>
            <p className="text-muted-foreground mt-1">
              스크립트 실행 기록과 결과를 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-primary">필터:</span>
        </div>
        {[
          { key: 'all', label: '전체', count: executions.length },
          { key: 'success', label: '성공', count: executions.filter(e => e.status === 'success').length },
          { key: 'failed', label: '실패', count: executions.filter(e => e.status === 'failed').length },
          { key: 'running', label: '실행 중', count: executions.filter(e => e.status === 'running').length }
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as any)}
            className={`px-4 py-2 rounded-lg border transition-all duration-300 flex items-center gap-2 ${
              filter === filterOption.key 
                ? 'bg-primary text-primary-foreground border-primary glow-accent' 
                : 'cyber-button'
            }`}
          >
            <span>{filterOption.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              filter === filterOption.key 
                ? 'bg-primary-foreground/20 text-primary-foreground' 
                : 'bg-primary/20 text-primary'
            }`}>
              {filterOption.count}
            </span>
          </button>
        ))}
      </div>

      {/* Execution History List */}
      <div className="cyber-card overflow-hidden">
        {filteredExecutions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-6">📊</div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">실행 이력이 없습니다</h3>
            <p className="text-muted-foreground">
              스크립트를 실행하면 이력이 여기에 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredExecutions.map((execution, index) => (
              <div 
                key={execution.id}
                className="p-6 hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusIcon(execution.status)}
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                        {execution.scriptName}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusClass(execution.status)}`}>
                        {getStatusText(execution.status)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>시작: {execution.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        <span>소요시간: {execution.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>성공: {execution.testsPassed}개</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-red-400" />
                        <span>실패: {execution.testsFailed}개</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-yellow-400" />
                        <span>경고: {execution.warnings}개</span>
                      </div>
                      {execution.exitCode !== null && (
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>종료코드: {execution.exitCode}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-4 bg-card/50 rounded-lg border border-border/50">
                      <div className="text-sm text-muted-foreground font-mono">
                        {execution.output}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-6">
                    <button
                      onClick={() => handleViewDetails(execution.id)}
                      className="cyber-button px-3 py-1.5 text-sm flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      세부사항
                    </button>
                    
                    {execution.status !== 'running' && (
                      <button
                        onClick={() => handleRerun(execution.id)}
                        className="cyber-button px-3 py-1.5 text-sm flex items-center gap-2"
                      >
                        <RotateCcw className="h-4 w-4" />
                        다시 실행
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stats-card p-6 text-center">
          <div className="text-2xl font-bold text-green-400 mb-2">
            {executions.filter(e => e.status === 'success').length}
          </div>
          <div className="text-sm text-muted-foreground">성공한 실행</div>
        </div>
        
        <div className="stats-card p-6 text-center">
          <div className="text-2xl font-bold text-red-400 mb-2">
            {executions.filter(e => e.status === 'failed').length}
          </div>
          <div className="text-sm text-muted-foreground">실패한 실행</div>
        </div>
        
        <div className="stats-card p-6 text-center">
          <div className="text-2xl font-bold text-primary mb-2">
            {executions.filter(e => e.status === 'running').length}
          </div>
          <div className="text-sm text-muted-foreground">실행 중</div>
        </div>
        
        <div className="stats-card p-6 text-center">
          <div className="text-2xl font-bold text-foreground mb-2">
            {executions.reduce((sum, e) => sum + e.testsPassed, 0)}
          </div>
          <div className="text-sm text-muted-foreground">총 성공 테스트</div>
        </div>
      </div>
    </div>
  );
}