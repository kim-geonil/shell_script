import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../hooks/redux';
import { 
  FileText, 
  Play, 
  Shield, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Activity,
  TrendingUp
} from 'lucide-react';
import { cn } from '../utils/cn';

// Layout components
import { DashboardContainer } from '../components/layout/Container';
import { StatsGrid, TwoColumnGrid, DashboardGrid } from '../components/layout/Grid';
import { PageHeader, HStack, VStack } from '../components/layout/Flex';
import { StaggeredList, StaggeredItem } from '../components/common/PageTransition';

export default function Dashboard() {
  const auth = useAuth();
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };

  // 대시보드 통계 데이터 (실제 데이터로 교체 예정)
  const stats = [
    {
      title: '총 스크립트',
      value: '12',
      description: '전체 스크립트 수',
      icon: FileText,
      color: 'text-blue-500',
      trend: '+3',
      animate: true
    },
    {
      title: '완료된 스크립트',
      value: '5',
      description: '성공적으로 완료',
      icon: CheckCircle,
      color: 'text-green-500',
      trend: '+1',
      animate: true
    },
    {
      title: '진행 중인 스크립트',
      value: '8',
      description: '현재 작업 중',
      icon: Clock,
      color: 'text-amber-500',
      trend: '+2',
      animate: true
    },
    {
      title: '실패한 스크립트',
      value: '2',
      description: '오류 발생',
      icon: AlertTriangle,
      color: 'text-red-500',
      trend: '-1',
      animate: true
    }
  ];

  // 최근 활동 데이터 (실제 데이터로 교체 예정)
  const recentActivities = [
    {
      id: '1',
      title: 'U-102 사용자 계정 보안 검사',
      type: 'script_created',
      status: 'success',
      timestamp: '2분 전',
      description: '새로운 보안 스크립트가 생성되었습니다.'
    },
    {
      id: '2',
      title: 'U-301 시스템 보안 설정 검사',
      type: 'test_executed',
      status: 'warning',
      timestamp: '15분 전',
      description: '테스트가 완료되었으나 경고사항이 있습니다.'
    },
    {
      id: '3',
      title: 'U-107 접근 제어 보안 검사',
      type: 'test_executed',
      status: 'success',
      timestamp: '1시간 전',
      description: '모든 검사 항목을 통과했습니다.'
    },
    {
      id: '4',
      title: '패스워드 정책 템플릿',
      type: 'template_used',
      status: 'success',
      timestamp: '2시간 전',
      description: '템플릿을 사용하여 스크립트를 생성했습니다.'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">성공</Badge>;
      case 'warning':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">경고</Badge>;
      case 'error':
        return <Badge variant="destructive">오류</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  return (
    <DashboardContainer>
      <div className="space-y-8 pb-8">
        <DashboardGrid className="gap-8">
        {/* 페이지 헤더 */}
        <PageHeader>
          <VStack spacing="sm" items="start">
            <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
            <p className="text-muted-foreground">
              안녕하세요, {auth.user?.name || 'User'}님! 보안 준수 검사 현황을 확인하세요.
            </p>
          </VStack>
          <HStack spacing="sm">
            <Button 
              onClick={() => navigate('/templates')}
              variant="outline"
            >
              <FileText className="h-4 w-4 mr-2" />
              템플릿 보기
            </Button>
            <Button 
              onClick={() => navigate('/scripts/new')}
            >
              <Plus className="h-4 w-4 mr-2" />
              새 스크립트
            </Button>
          </HStack>
        </PageHeader>

        {/* 통계 개요 섹션 */}
        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-semibold text-foreground">📊 통계 개요</h2>
            <p className="text-sm text-muted-foreground">시스템 전반의 주요 지표를 확인하세요</p>
          </div>
          
          <StaggeredList>
            <StatsGrid>
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <StaggeredItem key={index}>
                    <Card 
                      className={cn(
                        "hover:shadow-lg transition-all duration-300 border-l-4 bg-card/50 backdrop-blur-sm",
                        "transform hover:scale-105 hover:-translate-y-1",
                        "animate-fade-in-up",
                        stat.color === 'text-blue-500' && "border-l-blue-500/50",
                        stat.color === 'text-green-500' && "border-l-green-500/50",
                        stat.color === 'text-amber-500' && "border-l-amber-500/50",
                        stat.color === 'text-red-500' && "border-l-red-500/50"
                      )}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animationFillMode: 'backwards'
                      }}
                    >
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium group flex items-center gap-2">
                          <div className={cn(
                            "p-2 rounded-full transition-colors duration-300",
                            stat.color === 'text-blue-500' && "bg-blue-100 group-hover:bg-blue-200",
                            stat.color === 'text-green-500' && "bg-green-100 group-hover:bg-green-200",
                            stat.color === 'text-amber-500' && "bg-amber-100 group-hover:bg-amber-200",
                            stat.color === 'text-red-500' && "bg-red-100 group-hover:bg-red-200"
                          )}>
                            <Icon className={cn("h-4 w-4", stat.color)} />
                          </div>
                          {stat.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <HStack justify="between" items="end">
                          <VStack spacing="none" items="start">
                            <div className={cn(
                              "text-3xl font-bold transition-all duration-500",
                              stat.animate && "animate-count-up"
                            )}>
                              {stat.value}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {stat.description}
                            </p>
                          </VStack>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              'text-xs font-medium animate-bounce-in',
                              stat.trend.startsWith('+') 
                                ? 'text-green-600 border-green-200 bg-green-50' 
                                : 'text-red-600 border-red-200 bg-red-50'
                            )}
                            style={{ animationDelay: `${(index * 100) + 300}ms` }}
                          >
                            {stat.trend}
                          </Badge>
                        </HStack>
                      </CardContent>
                    </Card>
                  </StaggeredItem>
                );
              })}
            </StatsGrid>
          </StaggeredList>
        </div>

        {/* 구분선 */}
        <div className="w-full border-t border-border/50"></div>

        {/* 주요 기능 섹션 */}
        <div className="space-y-6">
          <div className="border-b border-border pb-4">
            <h2 className="text-lg font-semibold text-foreground">⚡ 주요 기능</h2>
            <p className="text-sm text-muted-foreground">자주 사용하는 기능과 최근 활동을 확인하세요</p>
          </div>

          <TwoColumnGrid>
            {/* 빠른 액션 */}
            <Card className="hover:shadow-lg transition-all duration-300 border border-border/50 bg-gradient-to-br from-card to-card/80">
              <CardHeader className="border-b border-border/20 bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  빠른 액션
                </CardTitle>
                <CardDescription>
                  자주 사용하는 기능에 빠르게 접근하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <VStack spacing="sm">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-primary/5 hover:border-primary/30 transition-all"
                    onClick={() => navigate('/templates')}
                  >
                    <Shield className="h-4 w-4 mr-2 text-blue-500" />
                    보안 템플릿 라이브러리
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-primary/5 hover:border-primary/30 transition-all"
                    onClick={() => navigate('/scripts')}
                  >
                    <FileText className="h-4 w-4 mr-2 text-green-500" />
                    내 스크립트 관리
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start hover:bg-primary/5 hover:border-primary/30 transition-all"
                    onClick={() => navigate('/test-results')}
                  >
                    <Activity className="h-4 w-4 mr-2 text-purple-500" />
                    테스트 결과 보기
                  </Button>
                </VStack>
              </CardContent>
            </Card>

            {/* 최근 활동 */}
            <Card className="hover:shadow-lg transition-all duration-300 border border-border/50 bg-gradient-to-br from-card to-card/80">
              <CardHeader className="border-b border-border/20 bg-muted/30">
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Activity className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  최근 활동
                </CardTitle>
                <CardDescription>
                  최근에 실행된 테스트와 스크립트 활동입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <VStack spacing="md">
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id} className={cn(
                      "p-3 rounded-lg border border-border/30 bg-muted/20 hover:bg-muted/40 transition-colors",
                      index !== recentActivities.length - 1 && "border-b border-border/20"
                    )}>
                      <HStack spacing="sm" items="start">
                        <div className="flex-shrink-0 mt-0.5">
                          {getStatusIcon(activity.status)}
                        </div>
                        <VStack spacing="xs" items="start" className="flex-1 min-w-0">
                          <HStack justify="between" className="w-full">
                            <p className="text-sm font-medium truncate">
                              {activity.title}
                            </p>
                            {getStatusBadge(activity.status)}
                          </HStack>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {activity.description}
                          </p>
                          <p className="text-xs text-muted-foreground/70">
                            {activity.timestamp}
                          </p>
                        </VStack>
                      </HStack>
                    </div>
                  ))}
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 hover:bg-muted/50 transition-colors"
                    onClick={() => navigate('/activity')}
                  >
                    모든 활동 보기
                  </Button>
                </VStack>
              </CardContent>
            </Card>
          </TwoColumnGrid>
        </div>
        </DashboardGrid>
      </div>
    </DashboardContainer>
  );
}