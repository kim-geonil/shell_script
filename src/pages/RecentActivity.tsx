import React from 'react';
import { Activity, FileText, Play, Bookmark, Save, Clock } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    {
      id: '1',
      type: 'script_created',
      title: 'U-102 보안 검사 스크립트 생성',
      description: '새로운 사용자 계정 보안 검사 스크립트를 생성했습니다.',
      timestamp: '2024-01-15 14:30:00',
      icon: FileText
    },
    {
      id: '2', 
      type: 'script_executed',
      title: 'U-103 패스워드 정책 검사 실행',
      description: '패스워드 복잡성 검사 스크립트를 실행했습니다.',
      timestamp: '2024-01-15 13:45:00',
      icon: Play
    },
    {
      id: '3',
      type: 'template_used',
      title: 'U-106 템플릿 사용',
      description: '세션 관리 검사 템플릿을 기반으로 스크립트를 생성했습니다.',
      timestamp: '2024-01-15 11:20:00',
      icon: Bookmark
    },
    {
      id: '4',
      type: 'script_saved',
      title: '보안 검사 스크립트 저장',
      description: '수정된 스크립트를 저장했습니다.',
      timestamp: '2024-01-15 10:15:00',
      icon: Save
    }
  ];

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'script_created': return 'text-green-400';
      case 'script_executed': return 'text-primary';
      case 'template_used': return 'text-yellow-400';
      case 'script_saved': return 'text-purple-400';
      default: return 'text-muted-foreground';
    }
  };

  const getActivityTypeBg = (type: string) => {
    switch (type) {
      case 'script_created': return 'bg-green-400/10';
      case 'script_executed': return 'bg-primary/10';
      case 'template_used': return 'bg-yellow-400/10';
      case 'script_saved': return 'bg-purple-400/10';
      default: return 'bg-muted/10';
    }
  };

  const getActivityTypeName = (type: string) => {
    switch (type) {
      case 'script_created': return '스크립트 생성';
      case 'script_executed': return '스크립트 실행';
      case 'template_used': return '템플릿 사용';
      case 'script_saved': return '스크립트 저장';
      default: return '기타';
    }
  };

  return (
    <div className="min-h-screen bg-background space-y-8">
      {/* Header */}
      <div className="cyber-card p-6 border-b border-border/50">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <Activity className="h-8 w-8 text-primary" />
            <div className="absolute inset-0 h-8 w-8 text-primary animate-pulse opacity-30">
              <Activity className="h-8 w-8" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-cyan-400 bg-clip-text text-transparent">
              최근 활동
            </h1>
            <p className="text-muted-foreground mt-1">
              최근 작업 내역을 확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="cyber-card overflow-hidden">
        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-6xl mb-6">📋</div>
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">활동 내역이 없습니다</h3>
            <p className="text-muted-foreground">
              스크립트를 생성하거나 실행하면 활동 내역이 표시됩니다.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {activities.map((activity, index) => {
              const IconComponent = activity.icon;
              return (
                <div 
                  key={activity.id}
                  className="p-6 hover:bg-primary/5 transition-all duration-300 group cursor-pointer"
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${getActivityTypeBg(activity.type)} border border-border/50 flex-shrink-0`}>
                      <IconComponent className={`h-5 w-5 ${getActivityTypeColor(activity.type)}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {activity.title}
                        </h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getActivityTypeColor(activity.type)} ${getActivityTypeBg(activity.type)}`}>
                          {getActivityTypeName(activity.type)}
                        </span>
                      </div>
                      
                      <p className="text-muted-foreground leading-relaxed">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{activity.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Future Features Card */}
      <div className="cyber-card p-6 text-center border border-primary/20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Activity className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-primary">향후 기능</h3>
        </div>
        <p className="text-muted-foreground text-sm">
          💡 향후 업데이트에서 활동 필터링, 검색, 그리고 더 상세한 이력 추적 기능이 추가될 예정입니다.
        </p>
      </div>
    </div>
  );
}