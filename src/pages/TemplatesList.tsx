import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
// React Router를 사용하지 않으므로 useNavigate 제거
import { 
  FileText,
  Search,
  Filter,
  Star,
  Download,
  Eye,
  Clock,
  User,
  Tag,
  Shield,
  Lock,
  Server
} from 'lucide-react';

// 임시 템플릿 데이터 (실제로는 Redux store에서 가져올 예정)
const mockTemplates = [
  {
    id: 'u102-basic',
    code: 'U-102',
    title: '사용자 계정 보안 검사',
    description: '시스템의 사용자 계정 설정과 보안 정책을 검사합니다.',
    category: 'user-security',
    difficulty: 'beginner',
    author: 'NcuScript Team',
    version: '1.0',
    downloadCount: 145,
    rating: 4.5,
    estimatedTime: '3-5분',
    tags: ['user-account', 'password', 'security', 'basic'],
    requirements: [
      'root 권한 필요',
      '/etc/passwd 파일 접근 권한',
      '/etc/shadow 파일 읽기 권한'
    ]
  },
  {
    id: 'u103-basic',
    code: 'U-103',
    title: '패스워드 정책 검사',
    description: '시스템의 패스워드 정책 설정을 검사하고 보안 강도를 평가합니다.',
    category: 'user-security',
    difficulty: 'intermediate',
    author: 'NcuScript Team',
    version: '1.0',
    downloadCount: 128,
    rating: 4.3,
    estimatedTime: '5-8분',
    tags: ['password-policy', 'pam', 'security', 'authentication'],
    requirements: [
      'root 권한 필요',
      'PAM 모듈 설정 파일 접근',
      '/etc/login.defs 파일 읽기 권한'
    ]
  },
  {
    id: 'u106-basic',
    code: 'U-106',
    title: '세션 관리 보안 검사',
    description: '시스템의 세션 타임아웃 및 관리 설정을 검사합니다.',
    category: 'access-control',
    difficulty: 'intermediate',
    author: 'NcuScript Team',
    version: '1.0',
    downloadCount: 98,
    rating: 4.2,
    estimatedTime: '4-6분',
    tags: ['session', 'timeout', 'ssh', 'security'],
    requirements: [
      'SSH 서비스 설정 파일 접근',
      '시스템 프로파일 파일 읽기 권한',
      'who, last 명령어 사용 가능'
    ]
  },
  {
    id: 'u107-basic',
    code: 'U-107',
    title: '접근 제어 보안 검사',
    description: '파일 및 디렉토리의 접근 권한 설정을 검사합니다.',
    category: 'access-control',
    difficulty: 'advanced',
    author: 'NcuScript Team',
    version: '1.0',
    downloadCount: 89,
    rating: 4.6,
    estimatedTime: '8-12분',
    tags: ['access-control', 'permissions', 'suid', 'sudo', 'advanced'],
    requirements: [
      'root 권한 필요',
      'find 명령어 사용 가능',
      'stat 명령어 사용 가능',
      '파일 시스템 전체 탐색 권한'
    ]
  },
  {
    id: 'u301-basic',
    code: 'U-301',
    title: '시스템 보안 설정 검사',
    description: '전반적인 시스템 보안 설정과 서비스 상태를 검사합니다.',
    category: 'system-security',
    difficulty: 'advanced',
    author: 'NcuScript Team',
    version: '1.0',
    downloadCount: 156,
    rating: 4.8,
    estimatedTime: '10-15분',
    tags: ['system-security', 'firewall', 'services', 'kernel', 'advanced'],
    requirements: [
      'root 권한 필요',
      'systemctl 명령어 사용 가능',
      'sysctl 명령어 사용 가능',
      '방화벽 도구 (ufw 또는 iptables)'
    ]
  }
];

export default function TemplatesList() {
  // 커스텀 네비게이션 함수
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'user-security':
        return <User className="h-4 w-4" />;
      case 'access-control':
        return <Lock className="h-4 w-4" />;
      case 'system-security':
        return <Server className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const getCategoryName = (category: string) => {
    switch (category) {
      case 'user-security':
        return '사용자 보안';
      case 'access-control':
        return '접근 제어';
      case 'system-security':
        return '시스템 보안';
      default:
        return '기타';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">초급</Badge>;
      case 'intermediate':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">중급</Badge>;
      case 'advanced':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">고급</Badge>;
      default:
        return <Badge variant="outline">-</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    const matchesDifficulty = difficultyFilter === 'all' || template.difficulty === difficultyFilter;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">템플릿 라이브러리</h1>
          <p className="text-muted-foreground">
            검증된 보안 검사 템플릿을 사용하여 스크립트를 빠르게 생성하세요.
          </p>
        </div>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            검색 및 필터
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="템플릿 제목, 설명, 태그로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="카테고리 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                <SelectItem value="user-security">사용자 보안</SelectItem>
                <SelectItem value="access-control">접근 제어</SelectItem>
                <SelectItem value="system-security">시스템 보안</SelectItem>
              </SelectContent>
            </Select>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="난이도 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 난이도</SelectItem>
                <SelectItem value="beginner">초급</SelectItem>
                <SelectItem value="intermediate">중급</SelectItem>
                <SelectItem value="advanced">고급</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 템플릿 목록 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTemplates.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">템플릿이 없습니다</h3>
                <p className="text-muted-foreground text-center">
                  검색 조건에 맞는 템플릿이 없습니다. 다른 검색어를 시도해보세요.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(template.category)}
                    <Badge variant="outline" className="text-xs">
                      {template.code}
                    </Badge>
                  </div>
                  {getDifficultyBadge(template.difficulty)}
                </div>
                <CardTitle className="text-lg group-hover:text-primary transition-colors">
                  {template.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* 메타 정보 */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    {getCategoryIcon(template.category)}
                    {getCategoryName(template.category)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {template.estimatedTime}
                  </span>
                </div>

                {/* 평점 및 다운로드 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {renderStars(template.rating)}
                    <span className="text-sm text-muted-foreground ml-1">
                      ({template.rating})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Download className="h-3 w-3" />
                    {template.downloadCount}
                  </div>
                </div>

                {/* 태그 */}
                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{template.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => navigate(`/templates/${template.id}`)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    상세보기
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => navigate(`/scripts/new?template=${template.id}`)}
                  >
                    사용하기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 결과 요약 */}
      {filteredTemplates.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          총 {filteredTemplates.length}개의 템플릿이 있습니다.
        </div>
      )}
    </div>
  );
}