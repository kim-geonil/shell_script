import React from 'react';
// React Router를 사용하지 않으므로 import 제거
import { Home, ArrowLeft, Search, FileText, HelpCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { PageTransition } from '../components/common/PageTransition';

// 추천 링크 데이터
const suggestedLinks = [
  {
    title: '대시보드',
    description: '전체 현황을 확인합니다',
    href: '/',
    icon: Home,
  },
  {
    title: '스크립트 목록',
    description: '생성된 스크립트를 관리합니다',
    href: '/scripts',
    icon: FileText,
  },
  {
    title: '템플릿 라이브러리',
    description: '검증된 템플릿을 찾아보세요',
    href: '/templates',
    icon: FileText,
  },
];

// 일반적인 경로 오타 매핑
const commonTypos: Record<string, string> = {
  '/script': '/scripts',
  '/template': '/templates',
  '/setting': '/settings',
  '/dashboard': '/',
  '/home': '/',
};

export default function NotFound() {
  // 커스텀 네비게이션 함수
  const navigate = (path: string | number) => {
    if (typeof path === 'number') {
      window.history.go(path);
    } else {
      window.history.pushState({}, '', path);
      window.dispatchEvent(new Event('popstate'));
    }
  };
  
  // 현재 위치 정보
  const getCurrentLocation = () => ({
    pathname: window.location.pathname,
  });
  
  const location = getCurrentLocation();
  const [searchQuery, setSearchQuery] = React.useState('');

  // 오타 수정 제안
  const suggestedPath = commonTypos[location.pathname.toLowerCase()];

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 실제로는 검색 API 호출
      console.log('Searching for:', searchQuery);
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl space-y-8">
          {/* 메인 404 섹션 */}
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-8xl md:text-9xl font-bold text-muted-foreground/20">
                404
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold">
                페이지를 찾을 수 없습니다
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                요청하신 페이지가 존재하지 않거나, 이동되었거나, 일시적으로 사용할 수 없습니다.
              </p>
            </div>

            {/* 현재 경로 표시 */}
            <div className="flex items-center justify-center">
              <Badge variant="outline" className="text-xs">
                {location.pathname}
              </Badge>
            </div>

            {/* 오타 수정 제안 */}
            {suggestedPath && (
              <Card className="border-yellow-200 dark:border-yellow-800">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-center space-x-3">
                    <HelpCircle className="w-5 h-5 text-yellow-600" />
                    <span className="text-sm">
                      혹시 <strong>{suggestedPath}</strong>를 찾고 계신가요?
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(suggestedPath)}
                    >
                      이동
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 검색 섹션 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                원하는 내용을 찾아보세요
              </CardTitle>
              <CardDescription>
                스크립트, 템플릿 또는 페이지를 검색해보세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="검색어를 입력하세요..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* 빠른 네비게이션 */}
          <Card>
            <CardHeader>
              <CardTitle>추천 페이지</CardTitle>
              <CardDescription>
                자주 사용하는 페이지로 이동해보세요.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {suggestedLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Button
                      key={link.href}
                      variant="outline"
                      onClick={() => navigate(link.href)}
                      className="h-auto p-4 flex flex-col items-start text-left"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{link.title}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {link.description}
                      </span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleGoBack} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              이전 페이지
            </Button>
            <Button onClick={() => navigate('/')}>
              <Home className="w-4 h-4 mr-2" />
              홈으로 이동
            </Button>
          </div>

          {/* 도움말 정보 */}
          <div className="text-center text-sm text-muted-foreground">
            <p>
              문제가 계속 발생한다면{' '}
              <button
                onClick={() => {
                  // TODO: 실제 지원 페이지로 이동
                  console.log('Opening support');
                }}
                className="text-primary hover:underline"
              >
                고객 지원팀
              </button>
              에 문의해주세요.
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}