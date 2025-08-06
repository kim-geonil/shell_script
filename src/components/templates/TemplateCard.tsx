import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../../components/ui/tooltip';
import {
  Shield,
  Clock,
  User,
  Download,
  Heart,
  Share2,
  MoreVertical,
  Play,
  Eye,
  Copy,
  Star,
  Calendar,
  Tags,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { SecurityTemplate, SecurityCategory, SecurityCheckType } from '../../types/template';
import { cn } from '../../utils/cn';
import { toast } from 'sonner';

interface TemplateCardProps {
  template: SecurityTemplate;
  onUse?: (template: SecurityTemplate) => void;
  onFavorite?: (templateId: string) => void;
  onShare?: (template: SecurityTemplate) => void;
  onDelete?: (templateId: string) => void;
  isFavorited?: boolean;
  isOwned?: boolean;
  className?: string;
}

const categoryColors: Record<SecurityCategory, string> = {
  [SecurityCategory.USER_ACCOUNT]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  [SecurityCategory.SYSTEM_SECURITY]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  [SecurityCategory.FILE_PERMISSIONS]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  [SecurityCategory.NETWORK_SECURITY]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  [SecurityCategory.SERVICE_CONFIGURATION]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  [SecurityCategory.LOG_AUDIT]: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200',
  [SecurityCategory.PASSWORD_POLICY]: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  [SecurityCategory.ACCESS_CONTROL]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  hard: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

export default function TemplateCard({
  template,
  onUse,
  onFavorite,
  onShare,
  onDelete,
  isFavorited = false,
  isOwned = false,
  className
}: TemplateCardProps) {

  const handleUse = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onUse) {
      onUse(template);
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onFavorite) {
      onFavorite(template.id);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onShare) {
      onShare(template);
    }
  };

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(template.content);
      toast.success('템플릿 코드가 클립보드에 복사되었습니다');
    } catch (error) {
      toast.error('복사에 실패했습니다');
    }
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    const blob = new Blob([template.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.name.replace(/\s+/g, '_')}_${template.type}.sh`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('템플릿이 다운로드되었습니다');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <TooltipProvider>
      <Card className={cn(
        'group hover:shadow-lg transition-all duration-200 cursor-pointer',
        'hover:border-primary/50 border-border/50',
        className
      )}>
        <Link to={`/templates/${template.id}`} className="block h-full">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={cn('text-xs', categoryColors[template.category])}>
                    {template.category.replace('_', ' ')}
                  </Badge>
                  {template.isOfficial && (
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="default" className="text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          공식
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>공식 검증된 템플릿</TooltipContent>
                    </Tooltip>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {template.type}
                  </Badge>
                </div>
                
                <CardTitle className="line-clamp-2 text-base group-hover:text-primary transition-colors">
                  {template.name}
                </CardTitle>
                
                <CardDescription className="line-clamp-2 text-sm mt-1">
                  {template.description}
                </CardDescription>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleUse}>
                    <Play className="h-4 w-4 mr-2" />
                    템플릿 사용
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-2" />
                    코드 복사
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload}>
                    <Download className="h-4 w-4 mr-2" />
                    다운로드
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleFavorite}>
                    <Heart className={cn(
                      'h-4 w-4 mr-2',
                      isFavorited && 'fill-current text-red-500'
                    )} />
                    {isFavorited ? '즐겨찾기 해제' : '즐겨찾기'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    공유
                  </DropdownMenuItem>
                  {isOwned && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.preventDefault();
                          if (onDelete) onDelete(template.id);
                        }}
                        className="text-destructive"
                      >
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>

          <CardContent className="pb-3">
            {/* Template metadata */}
            <div className="space-y-3">
              {/* Tags */}
              {template.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  <Tags className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                  {template.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>
              )}

              {/* Difficulty and time */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={cn('text-xs', difficultyColors[template.difficulty])}
                  >
                    {template.difficulty === 'easy' && '쉬움'}
                    {template.difficulty === 'medium' && '보통'}
                    {template.difficulty === 'hard' && '어려움'}
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span className="text-xs">{template.estimatedTime}분</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span className="text-xs">{template.author}</span>
                </div>
              </div>

              {/* Requirements preview */}
              {template.requirements.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">요구사항: </span>
                  <span>{template.requirements[0]}</span>
                  {template.requirements.length > 1 && (
                    <span> 외 {template.requirements.length - 1}개</span>
                  )}
                </div>
              )}
            </div>
          </CardContent>

          <CardFooter className="pt-0 flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>업데이트: {formatDate(template.updatedAt)}</span>
            </div>

            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={handleFavorite}
                  >
                    <Heart className={cn(
                      'h-4 w-4',
                      isFavorited && 'fill-current text-red-500'
                    )} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFavorited ? '즐겨찾기 해제' : '즐겨찾기'}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-3 text-xs"
                    onClick={handleUse}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    사용
                  </Button>
                </TooltipTrigger>
                <TooltipContent>이 템플릿 사용하기</TooltipContent>
              </Tooltip>
            </div>
          </CardFooter>
        </Link>
      </Card>
    </TooltipProvider>
  );
}