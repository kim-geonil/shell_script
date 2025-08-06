import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
// React Router를 사용하지 않으므로 useNavigate 제거
import { 
  FileText, 
  Plus, 
  Search,
  Filter,
  Calendar,
  User,
  Play,
  Edit,
  Trash2,
  Copy,
  Download
} from 'lucide-react';

// 임시 스크립트 데이터 (실제 Redux store에서 가져올 예정)
const mockScripts = [
  {
    id: '1',
    title: 'U-102 사용자 계정 보안 검사',
    description: '시스템의 사용자 계정 설정과 보안 정책을 검사합니다.',
    templateType: 'U-102',
    status: 'approved',
    version: '1.2',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20',
    createdBy: 'admin',
    tags: ['user-account', 'security', 'basic']
  },
  {
    id: '2',
    title: 'U-103 패스워드 정책 검사',
    description: '시스템의 패스워드 정책 설정을 검사하고 보안 강도를 평가합니다.',
    templateType: 'U-103',
    status: 'testing',
    version: '1.0',
    createdAt: '2024-01-18',
    updatedAt: '2024-01-22',
    createdBy: 'user1',
    tags: ['password-policy', 'security']
  },
  {
    id: '3',
    title: 'U-301 시스템 보안 설정 검사',
    description: '전반적인 시스템 보안 설정과 서비스 상태를 검사합니다.',
    templateType: 'U-301',
    status: 'draft',
    version: '0.9',
    createdAt: '2024-01-22',
    updatedAt: '2024-01-22',
    createdBy: 'admin',
    tags: ['system-security', 'advanced']
  },
  {
    id: '4',
    title: 'U-107 접근 제어 보안 검사',
    description: '파일 및 디렉토리의 접근 권한 설정을 검사합니다.',
    templateType: 'U-107',
    status: 'failed',
    version: '1.1',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-25',
    createdBy: 'user2',
    tags: ['access-control', 'permissions']
  }
];

export default function ScriptsList() {
  // 커스텀 네비게이션 함수
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    window.dispatchEvent(new Event('popstate'));
  };
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [templateFilter, setTemplateFilter] = useState('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">승인됨</Badge>;
      case 'testing':
        return <Badge className="bg-blue-100 text-blue-800">테스트 중</Badge>;
      case 'draft':
        return <Badge variant="secondary">초안</Badge>;
      case 'failed':
        return <Badge variant="destructive">실패</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const filteredScripts = mockScripts.filter(script => {
    const matchesSearch = script.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         script.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         script.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || script.status === statusFilter;
    const matchesTemplate = templateFilter === 'all' || script.templateType === templateFilter;
    
    return matchesSearch && matchesStatus && matchesTemplate;
  });

  return (
    <div className="space-y-6">
      {/* 페이지 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">스크립트 관리</h1>
          <p className="text-muted-foreground">
            생성된 보안 검사 스크립트를 관리하고 실행하세요.
          </p>
        </div>
        <Button onClick={() => navigate('/scripts/new')}>
          <Plus className="h-4 w-4 mr-2" />
          새 스크립트 생성
        </Button>
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
                  placeholder="스크립트 제목, 설명, 태그로 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="상태 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="approved">승인됨</SelectItem>
                <SelectItem value="testing">테스트 중</SelectItem>
                <SelectItem value="draft">초안</SelectItem>
                <SelectItem value="failed">실패</SelectItem>
              </SelectContent>
            </Select>
            <Select value={templateFilter} onValueChange={setTemplateFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="템플릿 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 템플릿</SelectItem>
                <SelectItem value="U-102">U-102</SelectItem>
                <SelectItem value="U-103">U-103</SelectItem>
                <SelectItem value="U-106">U-106</SelectItem>
                <SelectItem value="U-107">U-107</SelectItem>
                <SelectItem value="U-301">U-301</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 스크립트 목록 */}
      <div className="grid gap-4">
        {filteredScripts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium mb-2">스크립트가 없습니다</h3>
              <p className="text-muted-foreground text-center mb-4">
                검색 조건에 맞는 스크립트가 없습니다. 새로운 스크립트를 생성해보세요.
              </p>
              <Button onClick={() => navigate('/scripts/new')}>
                <Plus className="h-4 w-4 mr-2" />
                첫 번째 스크립트 생성
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredScripts.map((script) => (
            <Card key={script.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">{script.title}</CardTitle>
                      {getStatusBadge(script.status)}
                      <Badge variant="outline">{script.templateType}</Badge>
                    </div>
                    <CardDescription className="mb-3">
                      {script.description}
                    </CardDescription>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {script.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {script.createdBy}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {script.updatedAt}
                      </span>
                      <span>v{script.version}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      size="sm"
                      onClick={() => navigate(`/scripts/${script.id}`)}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      편집
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate(`/scripts/${script.id}/run`)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      실행
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Copy className="h-3 w-3 mr-1" />
                      복사
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Download className="h-3 w-3 mr-1" />
                      다운로드
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3 mr-1" />
                    삭제
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 결과 요약 */}
      {filteredScripts.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          총 {filteredScripts.length}개의 스크립트가 있습니다.
        </div>
      )}
    </div>
  );
}