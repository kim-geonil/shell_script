import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { 
  setSelectedTemplate,
  setFilter,
  clearFilter,
  incrementDownloadCount
} from '../store/slices/templatesSlice';
import TemplateCard from '../components/templates/TemplateCard';
import TemplateDetailDialog from '../components/templates/TemplateDetailDialog';
import TemplateFilter from '../components/templates/TemplateFilter';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  BookOpen, 
  Search, 
  Filter,
  Grid3x3,
  List,
  SortAsc,
  SortDesc,
  Download,
  Star,
  TrendingUp
} from 'lucide-react';

type SortOption = 'name' | 'downloads' | 'rating' | 'created';
type SortDirection = 'asc' | 'desc';

interface TemplateLibraryProps {
  onSelectTemplate?: (templateId: string) => void;
}

export default function TemplateLibrary({ onSelectTemplate }: TemplateLibraryProps = {}) {
  const dispatch = useDispatch();
  const { templates, selectedTemplate, filter } = useSelector(
    (state: RootState) => state.templates
  );
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('downloads');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // 필터링된 템플릿 목록
  const filteredTemplates = useMemo(() => {
    let filtered = [...templates];

    // 검색어 필터
    if (filter.search) {
      const query = filter.search.toLowerCase();
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(query) ||
        template.description.toLowerCase().includes(query) ||
        template.content.toLowerCase().includes(query) ||
        template.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // 카테고리 필터
    if (filter.category) {
      filtered = filtered.filter(template => template.category === filter.category);
    }

    // 난이도 필터
    if (filter.difficulty) {
      filtered = filtered.filter(template => template.difficulty === filter.difficulty);
    }

    // 태그 필터
    if (filter.tags && filter.tags.length > 0) {
      filtered = filtered.filter(template =>
        filter.tags!.some(tag => template.tags.includes(tag))
      );
    }

    // 정렬
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'downloads':
          comparison = ((a as any).downloadCount || 0) - ((b as any).downloadCount || 0);
          break;
        case 'rating':
          comparison = ((a as any).rating || 0) - ((b as any).rating || 0);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [templates, filter, sortBy, sortDirection]);

  // 사용 가능한 태그 목록
  const availableTags = useMemo(() => {
    const tags = new Set<string>();
    templates.forEach(template => {
      template.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [templates]);

  // 통계 데이터
  const stats = useMemo(() => {
    return {
      total: templates.length,
      filtered: filteredTemplates.length,
      categories: new Set(templates.map(t => t.category)).size,
      totalDownloads: templates.reduce((sum, t) => sum + ((t as any).downloadCount || 0), 0)
    };
  }, [templates, filteredTemplates]);

  const handleTemplateSelect = (template: any) => {
    dispatch(setSelectedTemplate(template));
  };

  const handleTemplateUse = (template: any) => {
    dispatch(incrementDownloadCount(template.id));
    
    // 외부에서 제공된 콜백이 있으면 호출 (SimpleDashboard에서 사용)
    if (onSelectTemplate) {
      onSelectTemplate(template.id);
    } else {
      // 기본 동작: 에디터로 이동하거나 스크립트 복사
      console.log('Using template:', template.content);
    }
  };

  const handleFilterChange = (newFilter: any) => {
    dispatch(setFilter(newFilter));
  };

  const handleClearFilter = () => {
    dispatch(clearFilter());
  };

  const toggleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl">템플릿 라이브러리</h1>
            <p className="text-muted-foreground">
              미리 작성된 보안 검사 스크립트를 사용하여 빠르게 검사를 시작하세요
            </p>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-sm text-muted-foreground">총 템플릿</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.filtered}</div>
                  <div className="text-sm text-muted-foreground">필터 결과</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.categories}</div>
                  <div className="text-sm text-muted-foreground">카테고리</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Download className="h-5 w-5 text-purple-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">총 다운로드</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex gap-6">
        {/* 필터 사이드바 */}
        <div className="w-80 space-y-4">
          <TemplateFilter
            filter={filter}
            onFilterChange={handleFilterChange}
            onClearFilter={handleClearFilter}
            availableTags={availableTags}
          />
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1">
          {/* 툴바 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">정렬:</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort('downloads')}
                  className={sortBy === 'downloads' ? 'bg-muted' : ''}
                >
                  <Download className="h-3 w-3 mr-1" />
                  다운로드
                  {sortBy === 'downloads' && (
                    sortDirection === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort('rating')}
                  className={sortBy === 'rating' ? 'bg-muted' : ''}
                >
                  <Star className="h-3 w-3 mr-1" />
                  평점
                  {sortBy === 'rating' && (
                    sortDirection === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSort('name')}
                  className={sortBy === 'name' ? 'bg-muted' : ''}
                >
                  이름
                  {sortBy === 'name' && (
                    sortDirection === 'asc' ? <SortAsc className="h-3 w-3 ml-1" /> : <SortDesc className="h-3 w-3 ml-1" />
                  )}
                </Button>
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              {filteredTemplates.length}개 템플릿
            </div>
          </div>

          {/* 템플릿 목록 */}
          {filteredTemplates.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg mb-2">템플릿을 찾을 수 없습니다</h3>
                <p className="text-muted-foreground mb-4">
                  검색 조건을 변경하거나 필터를 초기화해보세요.
                </p>
                <Button variant="outline" onClick={handleClearFilter}>
                  필터 초기화
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'
                : 'space-y-4'
            }>
              {filteredTemplates.map(template => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={handleTemplateSelect}
                  onUse={handleTemplateUse}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 템플릿 상세 대화상자 */}
      <TemplateDetailDialog
        template={selectedTemplate}
        isOpen={!!selectedTemplate}
        onClose={() => dispatch(setSelectedTemplate(null))}
        onUse={handleTemplateUse}
      />
    </div>
  );
}