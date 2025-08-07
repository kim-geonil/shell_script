import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { 
  Search, 
  FileText, 
  Shield, 
  Code, 
  BookOpen, 
  Download,
  Clock,
  Star,
  ArrowRight,
  Plus
} from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';

// 템플릿 데이터
const TEMPLATE_CATEGORIES = [
  {
    id: 'validation',
    title: '검증 샘플',
    description: '검증된 보안 검사 스크립트 샘플',
    icon: Shield,
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    templates: [
      {
        id: 'u102',
        name: 'U-102 패스워드 복잡성',
        description: '패스워드 복잡성 설정 검사',
        difficulty: 'easy',
        downloads: 1250,
        rating: 4.8
      },
      {
        id: 'u103',
        name: 'U-103 계정 잠금',
        description: '계정 잠금 임계값 설정 검사',
        difficulty: 'medium',
        downloads: 980,
        rating: 4.6
      },
      {
        id: 'u106',
        name: 'U-106 파일 권한',
        description: '중요 파일 권한 설정 검사',
        difficulty: 'easy',
        downloads: 1500,
        rating: 4.9
      }
    ]
  },
  {
    id: 'library',
    title: '템플릿 라이브러리',
    description: '다양한 보안 검사 템플릿 모음',
    icon: BookOpen,
    color: 'text-green-500',
    bgColor: 'bg-green-50',
    templates: [
      {
        id: 'basic',
        name: '기본 보안 검사',
        description: '일반적인 보안 검사 템플릿',
        difficulty: 'easy',
        downloads: 2100,
        rating: 4.7
      },
      {
        id: 'network',
        name: '네트워크 보안',
        description: '네트워크 설정 검사 템플릿',
        difficulty: 'hard',
        downloads: 750,
        rating: 4.5
      },
      {
        id: 'system',
        name: '시스템 보안',
        description: '시스템 전반 보안 검사',
        difficulty: 'medium',
        downloads: 1320,
        rating: 4.8
      }
    ]
  }
];

const RECENT_SEARCHES = [
  '패스워드 정책',
  '파일 권한 검사',
  '계정 보안',
  '네트워크 설정',
  '로그 감사'
];

const DIFFICULTY_COLORS = {
  easy: 'text-green-600 bg-green-100',
  medium: 'text-yellow-600 bg-yellow-100',
  hard: 'text-red-600 bg-red-100'
};

const DIFFICULTY_LABELS = {
  easy: '쉬움',
  medium: '보통',
  hard: '어려움'
};

export default function ScriptNew() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    // 선택한 템플릿으로 스크립트 에디터 이동
    navigate(`/scripts/editor?template=${templateId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 검색 결과 페이지로 이동
      navigate(`/scripts/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleRecentSearchClick = (search: string) => {
    setSearchQuery(search);
    navigate(`/scripts/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <PageTransition className="container mx-auto px-4 py-6 space-y-8">
      {/* 검색창 섹션 */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">검색창</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="보안 검사 스크립트나 템플릿을 검색하세요..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 text-lg h-14 border-2 focus:border-primary"
              />
              <Button 
                type="submit" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                disabled={!searchQuery.trim()}
              >
                검색
              </Button>
            </div>
          </form>
          
          {/* 최근 검색어 */}
          <div className="mt-4">
            <p className="text-sm text-muted-foreground mb-2">최근 검색어:</p>
            <div className="flex flex-wrap gap-2">
              {RECENT_SEARCHES.map((search) => (
                <Badge 
                  key={search}
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleRecentSearchClick(search)}
                >
                  {search}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 검증샘플 및 템플릿 라이브러리 섹션 */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">
            검증샘플 및 템플릿 라이브러리
          </CardTitle>
          <CardDescription className="text-base">
            (검색창에 입력시 해당 요소는 안보이게 함. 검색창에 아무것도 입력 안돼있을때 다시 보임.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {TEMPLATE_CATEGORIES.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <div key={category.id} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${category.bgColor}`}>
                    <IconComponent className={`h-6 w-6 ${category.color}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{category.title}</h3>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {category.templates.map((template) => (
                    <Card 
                      key={template.id}
                      className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-primary/40"
                      onClick={() => handleTemplateSelect(template.id)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${DIFFICULTY_COLORS[template.difficulty as keyof typeof DIFFICULTY_COLORS]}`}
                            >
                              {DIFFICULTY_LABELS[template.difficulty as keyof typeof DIFFICULTY_LABELS]}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {template.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              <span>{template.downloads.toLocaleString()}</span>
                            </div>
                            
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{template.rating}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-end">
                            <ArrowRight className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* 기존 자료 활용 섹션 */}
      <Card className="border-2 border-primary/20">
        <CardContent className="p-8">
          <div className="text-center space-y-4">
            <p className="text-lg">
              검색어 입력 후 기존 자료를 선택하면, 새로운 검증 참조 요구사항을 선택할 수 있는 요소가 뜨여염.
            </p>
            <p className="text-base text-muted-foreground">
              (기존자료 선택 전까지는 해당 요소는 안보임)
            </p>
            
            <div className="pt-6">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate('/scripts/editor')}
                className="gap-2"
              >
                <Plus className="h-5 w-5" />
                빈 스크립트로 시작하기
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </PageTransition>
  );
}