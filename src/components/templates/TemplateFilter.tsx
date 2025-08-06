import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Checkbox } from '../../../components/ui/checkbox';
import { Label } from '../../../components/ui/label';
import { Separator } from '../../../components/ui/separator';
import { ScrollArea } from '../../../components/ui/scroll-area';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../../components/ui/collapsible';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  Shield,
  Star,
  Clock,
  User,
  Tags,
  RefreshCw
} from 'lucide-react';
import { SecurityCategory, SecurityCheckType, TemplateFilter as TemplateFilterType } from '../../types/template';
import { cn } from '../../utils/cn';

interface TemplateFilterProps {
  filter: TemplateFilterType;
  onFilterChange: (filter: TemplateFilterType) => void;
  onReset: () => void;
  className?: string;
  totalCount?: number;
  filteredCount?: number;
}

const categoryLabels: Record<SecurityCategory, string> = {
  [SecurityCategory.USER_ACCOUNT]: '사용자 계정',
  [SecurityCategory.SYSTEM_SECURITY]: '시스템 보안',
  [SecurityCategory.FILE_PERMISSIONS]: '파일 권한',
  [SecurityCategory.NETWORK_SECURITY]: '네트워크 보안',
  [SecurityCategory.SERVICE_CONFIGURATION]: '서비스 설정',
  [SecurityCategory.LOG_AUDIT]: '로그 감사',
  [SecurityCategory.PASSWORD_POLICY]: '패스워드 정책',
  [SecurityCategory.ACCESS_CONTROL]: '접근 제어',
};

const typeLabels: Record<SecurityCheckType, string> = {
  [SecurityCheckType.U_102]: 'U-102 (사용자 계정)',
  [SecurityCheckType.U_103]: 'U-103 (패스워드 정책)',
  [SecurityCheckType.U_106]: 'U-106 (파일 권한)',
  [SecurityCheckType.U_107]: 'U-107 (접근 제어)',
  [SecurityCheckType.U_301]: 'U-301 (시스템 보안)',
  [SecurityCheckType.CUSTOM]: '사용자 정의',
};

const difficultyOptions = [
  { value: 'easy', label: '쉬움', color: 'text-green-600' },
  { value: 'medium', label: '보통', color: 'text-yellow-600' },
  { value: 'hard', label: '어려움', color: 'text-red-600' },
];

const popularTags = [
  '패스워드', '로그인', '접근제어', '파일권한', '네트워크',
  '방화벽', '로그감사', '계정보안', '서비스', '설정',
];

export default function TemplateFilter({
  filter,
  onFilterChange,
  onReset,
  className,
  totalCount = 0,
  filteredCount = 0
}: TemplateFilterProps) {
  const [searchValue, setSearchValue] = React.useState(filter.search || '');
  const [isAdvancedOpen, setIsAdvancedOpen] = React.useState(false);

  // Handle search input with debounce
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({ ...filter, search: searchValue });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleCategoryChange = (category: SecurityCategory, checked: boolean) => {
    onFilterChange({ ...filter, category: checked ? category : undefined });
  };

  const handleTypeChange = (type: SecurityCheckType, checked: boolean) => {
    onFilterChange({ ...filter, type: checked ? type : undefined });
  };

  const handleDifficultyChange = (difficulty: 'easy' | 'medium' | 'hard', checked: boolean) => {
    onFilterChange({ ...filter, difficulty: checked ? difficulty : undefined });
  };

  const handleOfficialChange = (checked: boolean) => {
    onFilterChange({ ...filter, isOfficial: checked ? true : undefined });
  };

  const handleTagToggle = (tag: string) => {
    const currentTags = filter.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    onFilterChange({ 
      ...filter, 
      tags: newTags.length > 0 ? newTags : undefined 
    });
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = (filter.tags || []).filter(tag => tag !== tagToRemove);
    onFilterChange({ 
      ...filter, 
      tags: newTags.length > 0 ? newTags : undefined 
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filter.search) count++;
    if (filter.category) count++;
    if (filter.type) count++;
    if (filter.difficulty) count++;
    if (filter.isOfficial) count++;
    if (filter.tags && filter.tags.length > 0) count += filter.tags.length;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              필터
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              총 {totalCount}개 중 {filteredCount}개 표시
            </CardDescription>
          </div>
          
          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              초기화
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="템플릿 이름, 설명으로 검색..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="pl-10"
          />
          {searchValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
              onClick={() => setSearchValue('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Selected tags */}
        {filter.tags && filter.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {filter.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeTag(tag)}
              >
                {tag}
                <X className="h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}

        {/* Quick filters */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="official"
              checked={filter.isOfficial || false}
              onCheckedChange={handleOfficialChange}
            />
            <Label htmlFor="official" className="flex items-center gap-2 cursor-pointer">
              <Shield className="h-4 w-4 text-blue-600" />
              공식 템플릿만 보기
            </Label>
          </div>
        </div>

        <Separator />

        {/* Advanced filters */}
        <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between p-0 font-normal"
            >
              고급 필터
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform duration-200",
                isAdvancedOpen && "transform rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 pt-4">
            {/* Category */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">카테고리</Label>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {Object.entries(categoryLabels).map(([key, label]) => {
                    const category = key as SecurityCategory;
                    return (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${key}`}
                          checked={filter.category === category}
                          onCheckedChange={(checked) => 
                            handleCategoryChange(category, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={`category-${key}`} 
                          className="text-sm cursor-pointer"
                        >
                          {label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Check Type */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">검사 유형</Label>
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {Object.entries(typeLabels).map(([key, label]) => {
                    const type = key as SecurityCheckType;
                    return (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={`type-${key}`}
                          checked={filter.type === type}
                          onCheckedChange={(checked) => 
                            handleTypeChange(type, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={`type-${key}`} 
                          className="text-sm cursor-pointer"
                        >
                          {label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">난이도</Label>
              <div className="space-y-2">
                {difficultyOptions.map(({ value, label, color }) => (
                  <div key={value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`difficulty-${value}`}
                      checked={filter.difficulty === value}
                      onCheckedChange={(checked) => 
                        handleDifficultyChange(value as any, checked as boolean)
                      }
                    />
                    <Label 
                      htmlFor={`difficulty-${value}`} 
                      className={cn("text-sm cursor-pointer", color)}
                    >
                      {label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">인기 태그</Label>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => {
                  const isSelected = filter.tags?.includes(tag);
                  return (
                    <Badge
                      key={tag}
                      variant={isSelected ? "default" : "outline"}
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}