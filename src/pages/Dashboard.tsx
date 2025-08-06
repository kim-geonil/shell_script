import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../hooks/redux';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // 대시보드 통계 데이터 (실제 데이터로 교체 예정)
  const stats = [
    {
      title: '전체 스크립트',
      value: '24',
      description: '생성된 스크립트 수',
      icon: FileText,
      color: 'text-blue-500',
      trend: '+12%'
    },
    {
      title: '실행된 테스트',
      value: '156',
      description: '이번 달 실행',
      icon: Play,
      color: 'text-green-500',
      trend: '+23%'
    },
    {
      title: '보안 검사',
      value: '89%',
      description: '통과율',
      icon: Shield,
      color: 'text-purple-500',
      trend: '+5%'
    },
    {
      title: '평균 실행 시간',
      value: '4.2분',
      description: '최근 30일',
      icon: Clock,
      color: 'text-orange-500',
      trend: '-8%'
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
      <DashboardGrid>
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

        {/* 통계 카드 그리드 */}
        <StaggeredList>
          <StatsGrid>
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <StaggeredItem key={index}>
                  <Card className="hover:shadow-lg transition-all duration-200">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        {stat.title}
                      </CardTitle>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </CardHeader>
                    <CardContent>
                      <HStack justify="between" items="end">
                        <VStack spacing="none" items="start">
                          <div className="text-2xl font-bold">{stat.value}</div>
                          <p className="text-xs text-muted-foreground">
                            {stat.description}
                          </p>
                        </VStack>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-xs',
                            stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          )}
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

        <TwoColumnGrid>
          {/* 빠른 액션 */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                빠른 액션
              </CardTitle>
              <CardDescription>
                자주 사용하는 기능에 빠르게 접근하세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VStack spacing="sm">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/templates')}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  보안 템플릿 라이브러리
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/scripts')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  내 스크립트 관리
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigate('/test-results')}
                >
                  <Activity className="h-4 w-4 mr-2" />
                  테스트 결과 보기
                </Button>
              </VStack>
            </CardContent>
          </Card>

          {/* 최근 활동 */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                최근 활동
              </CardTitle>
              <CardDescription>
                최근에 실행된 테스트와 스크립트 활동입니다.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <VStack spacing="md">
                {recentActivities.map((activity) => (
                  <HStack key={activity.id} spacing="sm" items="start">
                    <div className="flex-shrink-0">
                      {getStatusIcon(activity.status)}
                    </div>
                    <VStack spacing="xs" items="start" className="flex-1 min-w-0">
                      <HStack justify="between" className="w-full">
                        <p className="text-sm font-medium truncate">
                          {activity.title}
                        </p>
                        {getStatusBadge(activity.status)}
                      </HStack>
                      <p className="text-xs text-muted-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.timestamp}
                      </p>
                    </VStack>
                  </HStack>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full mt-4"
                  onClick={() => navigate('/activity')}
                >
                  모든 활동 보기
                </Button>
              </VStack>
            </CardContent>
          </Card>
        </TwoColumnGrid>
      </DashboardGrid>
    </DashboardContainer>
  );
}